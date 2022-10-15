// Get the modal
const sizeGuideModal = document.getElementById("SizeGuideModal");
const btnOpenSizeGuide = document.getElementsByClassName("btn-open-size-guide");
const spanCloseModal = document.querySelector("#SizeGuideModal .close");

productPageModule.controller('SizeGuideController', function ($scope, $http, $timeout) {

    $scope.type = 'male';
    $scope.productId = null;
    $scope.productSkuId = null;
    $scope.sizeGuides = [];
    $scope.activeSizeGuide = null;
    $scope.subSizeGuideMenu = [];
    $scope.unit = 'inch';

    $scope.lifeTime = 'init';

    $scope.sizeGuideState = {
        'male': null,
        'female': null,
        'youth': null
    }

    function init() {
        if (typeof btnOpenSizeGuide != 'undefined' && btnOpenSizeGuide) {
            for (let i = 0; i < btnOpenSizeGuide.length; i++) {
                btnOpenSizeGuide[i].onclick = function (e) {
                    e.preventDefault();
                    $scope.callOpenSizeGuide();
                }
            }
        }

        window.addEventListener('popstate', function() {
            let urlString = window.location.href;
            let url = new URL(urlString);
            $scope.productSkuId = url.searchParams.get("spid");

            loadSizeGuideBySku();
        });
    }

    window.callOpenSizeGuide = function() {
        document.getElementsByTagName('body')[0].classList.add('open-size-guide-pop');
        sizeGuideModal.style.display = "block";

        let productSkuId = document.getElementById('productSkuId').value;
        if (!$scope.productSkuId || parseInt($scope.productSkuId) !== parseInt(productSkuId)) {
            $scope.productSkuId = productSkuId;
            loadSizeGuideBySku(true);
        } else if (!$scope.sizeGuides.length) {
            loadSizeGuide();
        }
    }

    $scope.callOpenSizeGuide = window.callOpenSizeGuide;

    $scope.changeSizeGuide = function (sizeGuide, userClick = false) {

        if(userClick === true && $scope.loadingSizeGuide === true) return;

        if(typeof $scope.activeSizeGuide != 'undefined' && $scope.activeSizeGuide && sizeGuide.id == $scope.activeSizeGuide.id) {
            return;
        }

        $scope.subSizeGuideMenu = [];

        if (typeof sizeGuide.children != 'undefined' && sizeGuide.children.length) {
            $scope.subSizeGuideMenu = sizeGuide.children;

            // tìm size guide phù hợp, nếu không có => lấy sub đầu tiên làm active
            $scope.activeSizeGuide = $scope.subSizeGuideMenu[0];
        } else {
            // Tìm cha
            let parentSizeGuide = $scope.sizeGuides.find((refSizeGuide) => {
                return refSizeGuide.id == sizeGuide.parent_id;
            });

            if (parentSizeGuide) {
                $scope.subSizeGuideMenu = parentSizeGuide.children;
            }

            $scope.activeSizeGuide = sizeGuide;
        }

        // document.getElementById('btnChangeUnit').style.display = 'block';
        for (const key in $scope.activeSizeGuide.sizes_data) {
            if (Object.hasOwnProperty.call($scope.activeSizeGuide.sizes_data, key)) {
                const dimension = $scope.activeSizeGuide.sizes_data[key];
                if(
                    (!dimension.hasOwnProperty('inch') && $scope.unit === 'inch') ||
                    (!dimension.hasOwnProperty('cm') && $scope.unit === 'cm')
                ) {
                    $scope.changeSizeGuideUnit();
                    document.getElementById('btnChangeUnit').style.display = 'none';
                    break;
                } else if (dimension.hasOwnProperty('inch') && dimension.hasOwnProperty('cm')) {
                    if(!Object.values(dimension[$scope.unit]).filter(e => e).length) {
                        $scope.changeSizeGuideUnit();
                        document.getElementById('btnChangeUnit').style.display = 'none';
                        break;
                    }
                }
            }
        }

        $scope.sizeGuideState[$scope.type] = $scope.activeSizeGuide;
    }

    $scope.checkActiveMenu = function (sizeGuide) {
        let returnValue = false;
        if (typeof $scope.activeSizeGuide != 'undefined' && $scope.activeSizeGuide) {
            if ($scope.activeSizeGuide.id == sizeGuide.id || $scope.activeSizeGuide.parent_id == sizeGuide.id) {
                returnValue = true;
            }
        }
        return returnValue;
    }

    $scope.checkActiveSubMenu = function (sizeGuide) {
        let returnValue = false;
        if (typeof $scope.activeSizeGuide != 'undefined' && $scope.activeSizeGuide) {
            if ($scope.activeSizeGuide.id == sizeGuide.id) {
                returnValue = true;
            }
        }
        return returnValue;
    }

    $scope.changeType = function (type, force = false) {
        if($scope.loadingSizeGuide && !force) return;

        $scope.activeSizeGuide = null;
        $scope.subSizeGuideMenu = [];

        let btns = document.getElementsByClassName('btn-change-size-guide-type');
        for (i = 0; i < btns.length; ++i) {
            if (btns[i].dataset.type == type) {
                btns[i].classList.remove('light');
                btns[i].classList.add('dark');
            } else {
                btns[i].classList.remove('dark');
            }
        }

        let preType = angular.copy($scope.type);
        $scope.type = type;

        if(!force) loadSizeGuide(preType);

    }

    $scope.changeSizeGuideUnit = function () {
        let displayUnit = 'Inches';
        if ($scope.unit === 'inch') {
            $scope.unit = 'cm';
        } else {
            $scope.unit = 'inch';
            displayUnit = 'Centimeters';
        }

        document.getElementById('btnChangeUnit').innerText = sizeGuideTrans['Switch to ' + capitalizeFirstLetter(displayUnit)];
    }

    function loadSizeGuideBySku(force = false)
    {
        $http({
            method: 'get',
            url: base_api_url + '/size-guide/type/' + $scope.productSkuId,
        }).then(function success(response) {

            if (response.data.type) {
                $scope.type = response.data.type;
            }

            if ($scope.lifeTime === 'running' || force) {
                $scope.changeType($scope.type, true)
                loadSizeGuide();
            }

        });
    }

    function loadSizeGuide(oldType = false)
    {
        $scope.subSizeGuideMenu = [];
        $scope.loadingSizeGuide = true;

        let productIdSelector = document.getElementById('productId');
        if (typeof productIdSelector != 'undefined' && productIdSelector) {
            $scope.productId = productIdSelector.value;
            let type = 'male';
            if ($scope.type) {
                type = angular.copy($scope.type);
            }
            if($scope.lifeTime === 'init') {
                $scope.lifeTime = 'running';
            }

            $http({
                method: 'get',
                url: base_api_url + '/size-guide/customer-size-guide/' + $scope.productId + '?type=' + type,
            }).then(function success(response) {
                if (response.data.status === 'successful') {

                    let listSizeGuides = response.data.result.list_size_guides;
                    let defaultSizeGuide = response.data.result.size_guide;

                    $scope.sizeGuides = listSizeGuides;

                    let hasActiveSizeGuide = false;

                    // Init
                    if(defaultSizeGuide && !oldType) {
                        $scope.changeType(defaultSizeGuide.type, true);
                        let foundActive = $scope.sizeGuides.find((refSizeGuide) => {
                            return refSizeGuide.id == defaultSizeGuide.id;
                        });
                        if(foundActive) {
                            $scope.changeSizeGuide(foundActive);
                            hasActiveSizeGuide = true;
                        }
                    }

                    if (oldType && $scope.sizeGuideState[oldType]) {
                        let foundActive = $scope.sizeGuides.find((refSizeGuide) => {
                            return refSizeGuide.title.toLowerCase() == $scope.sizeGuideState[oldType].title.toLowerCase();
                        });
                        if(foundActive) {
                            $scope.changeSizeGuide(foundActive);
                            hasActiveSizeGuide = true;
                        }
                    }

                    if (!hasActiveSizeGuide && $scope.sizeGuideState[$scope.type]) {
                        $scope.changeSizeGuide($scope.sizeGuideState[$scope.type]);
                        hasActiveSizeGuide = true;
                    }

                    if(!hasActiveSizeGuide && $scope.sizeGuides.length) {
                        if ($scope.type) {

                            $scope.changeType($scope.type, true);
                            let foundActive = $scope.sizeGuides.find((refSizeGuide) => {
                                return refSizeGuide.type == $scope.type;
                            });
                            if (foundActive) {
                                $scope.changeSizeGuide(foundActive);
                            }

                        } else if ($scope.sizeGuides[0]) {
                            $scope.changeSizeGuide($scope.sizeGuides[0]);
                        }
                    }

                } else {
                    toastr.error('Error load size guide!');
                }

                $timeout(function () {
                    $scope.loadingSizeGuide = false;
                });

            });
        }
    }

    init();

});

// When the user clicks on <span> (x), close the modal
spanCloseModal.onclick = function () {
    closeSizeGuidePop();
}

// When the user clicks anywhere outside of the modal, close it
// This event also is loaded on file style-info-angular
window.onclick = function (event) {
    if (event.target == sizeGuideModal) {
        closeSizeGuidePop();
    }
}

function closeSizeGuidePop() {
    sizeGuideModal.style.display = "none";
    document.getElementsByTagName('body')[0].classList.remove('open-size-guide-pop');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}