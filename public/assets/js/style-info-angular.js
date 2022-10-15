// Get the modal
const styleInfoModal = document.getElementById("StyleInfoModal");
const btnOpenStyleInfo = document.getElementById("btnOpenStyleInfo");
const spanCloseModalStyle = document.querySelector("#StyleInfoModal .close");

productPageModule.controller('StyleInfoController', function ($scope, $http, $timeout) {
    $scope.styles = styleInfoStyles;
    $scope.types = styleInfoTypes;
    $scope.currentStyle = null;
    $scope.currentStyleId = null;
    $scope.currentTypeId = null;
    $scope.content = null;
    $scope.productIdInfoStyle = 0;
    function init() {
        $scope.productIdInfoStyle = $("#productId").val();
        if (typeof btnOpenStyleInfo != "undefined" && btnOpenStyleInfo) {
            btnOpenStyleInfo.onclick = function (e) {
                e.preventDefault();
                styleInfoModal.style.display = "block";
                $scope.currentTypeId = Number(
                    $("#js-select-variant-5 .active").attr(
                        "data-variant-option-id"
                    )
                );
                $scope.currentStyleId = Number($("#js-select-variant-7").val());
                getProductDescriptions();
            };
        }
    }

    const getProductDescriptions = () => {
        let url = `/module/get-description?hide_table_properties=1&product_id=${$scope.productIdInfoStyle}`;
        if ($scope.currentStyleId) {
            url += `&style_id=${$scope.currentStyleId}`
        }
        if ($scope.currentTypeId) {
            url += `&type_id=${$scope.currentTypeId}`;
        }
        $http
            .get(url)
            .then((res) => {
                if (res.data.status == "successful") {
                    $scope.content = res.data.result;
                }
            });
    }
    
    $scope.changeStyle = (styleId) => {
        $scope.currentStyleId = styleId;
        getProductDescriptions();
    };
    $scope.changeType = (typeId) => {
        $scope.currentTypeId = typeId;
        getProductDescriptions();
    }

    init();

});

// When the user clicks on <span> (x), close the modal
spanCloseModalStyle.onclick = function () {
    styleInfoModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == styleInfoModal) {
        styleInfoModal.style.display = "none";
    }
    if (event.target == sizeGuideModal) {
        sizeGuideModal.style.display = "none";
        document
            .getElementsByTagName("body")[0]
            .classList.remove("open-size-guide-pop");
    }
}
