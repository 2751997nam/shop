
const customerModule = angular.module('customer', []);

customerModule.factory('httpRequestInterceptor', function () {
    return {
        request: function (config) {
            config.headers['token'] = $('meta[name="customer-token"]').attr('content');
            return config;
        }
    };
});

customerModule.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});

customerModule.controller('profileController', ['$scope', '$http', function($scope, $http) {

    $scope.countries = [];
    $scope.provinces = [];
    $scope.customer = customer;
    $scope.messages = [];
    $scope.states = {
        isOpeningSelectCountry: false,
        isOpeningSelectProvince: false,
        typing: null,
        countrySearchKeyWord: '',
        provinceSearchKeyWord: '',
        isHasProvince: false,
        isLoading: false
    }

    async function init() {

        // click out country input
        $(document).click(function(event) {
            const $target = $(event.target);
            if(!$target.closest('#countryContent').length && $('.countries-dropdown').is(":visible")) {
               $scope.closeCountrySelect();
            }
            if(!$target.closest('#provinceContent').length && $('.countries-dropdown').is(":visible")) {
                $scope.closeProvinceSelect();
            }
        });

        $('.p-input, .p-input input').on('focus', function() {
            let pInput = $(this).closest('.p-input');
            if (pInput.hasClass('error')) {
                pInput.removeClass('error');
            }
        });

        // parse string
        if ($scope.customer.country_id) {
            $scope.customer.country_id = $scope.customer.country_id.toString();
        }

        $scope.states.isLoading = true;
        // load countries, provinces
        await $scope.getCountries();

        let provinces = await $scope.getProvinces('country_id=' + $scope.customer.country_id);
        $scope.states.isHasProvince = provinces.length > 0;

        $scope.states.isLoading = false;
        safeApply();
    }

    $scope.openCountrySelect = function() {
        $scope.states.isOpeningSelectCountry = true;
        $('#countriesDropdown').slideDown(300, function() {
            $('#selectCountryInput').focus();
        });
    }

    $scope.openProvinceSelect = function() {
        $scope.states.isOpeningSelectProvince = true;
        $('#provincesDropdown').slideDown(300, function() {
            $('#selectProvinceInput').focus();
        });
    }

    $scope.closeCountrySelect = function() {
        $scope.states.isOpeningSelectCountry = false;
        $('#countriesDropdown').hide();
        safeApply();
    }

    $scope.closeProvinceSelect = function() {
        $scope.states.isOpeningSelectProvince = false;
        $('#provincesDropdown').hide();
        safeApply();
    }

    $scope.selectCountry = function(country) {
        $scope.closeCountrySelect();
        $scope.customer.country = country;

        // load state
        let filters = 'country_id=' + country.id;
        $scope.getProvinces(filters).then((provinces) => {
            $scope.states.isHasProvince = provinces.length > 0;
            safeApply();
        });
    }

    $scope.selectProvince = function(province) {
        $scope.closeProvinceSelect();
        $scope.customer.province = province;
    }

    $scope.searchCountry = function() {
        if ($scope.states.typing) {
            clearTimeout($scope.states.typing);
        }

        $scope.states.typing = setTimeout(() => {
            $scope.getCountries('nicename~' + $scope.states.countrySearchKeyWord);
        }, 200);
    }

    $scope.searchProvince = function() {
        if ($scope.states.typing) {
            clearTimeout($scope.states.typing);
        }

        $scope.states.typing = setTimeout(() => {
            // load state
            let filters = 'country_id=' + $scope.customer.country.id + ',name~' + $scope.states.provinceSearchKeyWord;
            $scope.getProvinces(filters);
        }, 200);
    }

    $scope.getCountries = function(filters = null) {
        return new Promise (function (resolve) {

            let apiReq = apiUrl + '/countries';
            if (filters) {
                apiReq = apiReq + '?filters=' + filters;
            }

            $http.get(apiReq).then(function (response) {
                $scope.countries = response.data.result;
                resolve(response.data.result);
            }, function (error) {
                console.log(error);
                resolve(null);
            });

        });
    }

    $scope.getProvinces = function(filters) {
        return new Promise (function (resolve) {
            const urlProvince = apiUrl + '/province?page_size=1000&filters=' + filters;
            $http.get(urlProvince).then(function (response) {
                $scope.provinces = response.data.result;
                resolve(response.data.result);
            }, function (error) {
                console.log(error);
                resolve(null);
            });
        });
    }

    $scope.updateProfile = function() {

        let customerUpdateData = {};

        customerUpdateData.id = $scope.customer.id;

        customerUpdateData.address = $scope.customer.address;
        customerUpdateData.gender = $scope.customer.gender;
        customerUpdateData.zip_code = $scope.customer.zip_code;
        customerUpdateData.optional_address = $scope.customer.optional_address;
        customerUpdateData.city_name = $scope.customer.city_name;

        customerUpdateData.full_name = $scope.customer.full_name;
        customerUpdateData.phone = $scope.customer.phone;

        if ($scope.customer.country) {
            customerUpdateData.country_id = $scope.customer.country.id;
            if ($scope.customer.province) {
                customerUpdateData.province_id = $scope.customer.province.id;
            }
        }

        if (!$scope.states.isHasProvince) {
            customerUpdateData.province_id = null;
        }

        let hasError = false;

        if (!customerUpdateData.full_name) {
            $('#fullnameInput').addClass('error');
            hasError = true;
        }

        if (!customerUpdateData.phone) {
            $('#phoneInput').addClass('error');
            hasError = true;
        }

        if (!customerUpdateData.country_id) {
            $('#countryInput').addClass('error');
            hasError = true;
        }

        if ($('.change-pass-box').is(":visible")) {

            customerUpdateData.password = $scope.customer.password;
            customerUpdateData.new_password = $scope.customer.new_password;

            if (!customerUpdateData.password || customerUpdateData.password.length < 6) {
                $('#customerPassword').addClass('error');
                hasError = true;
            }

            if (!customerUpdateData.new_password || customerUpdateData.new_password.length < 6) {
                $('#customerNewPassword').addClass('error');
                hasError = true;
            }

            if (!$scope.customer.confirm_password || $scope.customer.confirm_password.length < 6
                || $scope.customer.confirm_password !== customerUpdateData.new_password) {
                $('#customerConfirmPassword').addClass('error');
                hasError = true;
            }

        }

        if (!hasError) {  // submit
            postUpdate(customerUpdateData);
        } else {
            let errorInputs = document.getElementsByClassName('error');
            if (errorInputs.length) {
                errorInputs[0].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
            }
        }

    }

   function postUpdate(customerUpdateData) {

       $scope.states.isLoading = true;
       const url = apiUrl + '/customer/update-profile';

       $http.put(url, {
           profile: customerUpdateData
       }).then(function (response) {
           $scope.states.isLoading = false;

           if (response.data.messages) {
               $scope.messages = response.data.messages;
           }

       }, function (error) {
           $scope.states.isLoading = false;
           console.log(error);
       });

    }

    function safeApply(call = null) {
        if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
            $scope.$apply();
        }
    }

    init();

}]);

customerModule.controller('myOrderController', ['$scope', '$http', function($scope, $http) {

    $scope.template = datetimeTemplate;
    $scope.orders = [];
    $scope.states = {
        selectedLocale: $('#selectedLocate').val(),
        isLoading: false
    }

    async function init() {
        $scope.getMyOrders();
    }

    $scope.orderStatus = function(order) {
        return {
            'success': order.status === 'FINISHED',
            'process': ['PROCESSING', 'PENDING', 'ISSUED'].includes(order.status),
            'delivering': ['DELIVERING', 'READY_TO_SHIP'].includes(order.status),
            'cancel': ['CANCELED', 'REQUEST_RETURN', 'RETURNED'].includes(order.status)
        }
    };

    $scope.changeLocale = function() {
        $scope.getMyOrders();
    }

    $scope.getMyOrders = function() {

        const url = apiUrl + '/customer/get-my-order?locale=' + $scope.states.selectedLocale;
        $scope.orders = [];
        $scope.states.isLoading = true;

        $http.get(url).then(function (response) {
            if (response.data && typeof response.data == 'object') {
                $scope.orders = response.data;
            } else {
                alert(response.data);
            }
            $scope.states.isLoading = false;
        }, function (error) {
            console.warn(error);
            $scope.states.isLoading = false;
        });

    }

    $scope.formatTime = function(t) {
        var t = t.split(/[- :]/);
        var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));

        var year = d.getFullYear();
        var month = d.toLocaleString(getLang(), { month: 'long' });
        var date = d.getDate();
        let retval = $scope.template;
        retval = retval.replace("#month", month);
        retval = retval.replace("#date", date);
        retval = retval.replace("#year", year);
        return retval;
    }

    function getLang() {
        if (navigator.languages != undefined)
            return navigator.languages[0];
        return navigator.language;
    }

    $scope.formatPrice = function (price) {
        return formatPrice(price, priceTempate);
    };

    init();

}]);