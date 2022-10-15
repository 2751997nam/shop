productPageModule.controller('RelatedProductController', function ($scope, $http, $rootScope) {
    $scope.products = [];
    $scope.newCategoryproducts = [];
    $scope.relatedSearches = [];

    $scope.initialize = function () {
        $scope.find();

        if (window.recommendation_url) {
            $scope.loadRelatedSearches();
        }

    }

    $scope.getImageCdn = window.getImageCdn;

    $scope.find = function () {
        let relatedUrl = $scope.buildUrl('/product/related/' + $('#productId').val());
        // relatedUrl = '/related-product.json'; // fake
        $http.get(relatedUrl)
            .then(function (response) {
                if (response.data.status === 'successful') {

                    let categoryLessOrder = response.data.category_less_order;
                    let categoryLessOrderProducts = response.data.category_less_order_product;
                    let products = response.data.result;

                    categoryLessOrderProducts.map(function(e) {
                        return e.internal_source = 'new-category';
                    });

                    products.map(function(e) {
                        return e.internal_source = 'also-like';
                    });

                    if (categoryLessOrder) {
                        $scope.relatedSearches = [... $scope.relatedSearches, ... categoryLessOrder];
                    }

                    $scope.relatedSearches = $scope.relatedSearches .filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.title === value.title
                        ))
                    );

                    $scope.products = products;
                    $scope.newCategoryproducts = categoryLessOrderProducts;

                    $scope.reinitSlick();
                }
            })
    }

    $scope.loadRelatedSearches = function() {
        let relatedUrl = window.recommendation_url + '/recommendation/keywords/' + $('#productId').val();
        // relatedUrl = '/related-searches.json'; // fake
        $http.get(relatedUrl)
            .then(function (response) {
                if (response.data.status === 'successful') {
                    $scope.relatedSearches = [ ...$scope.relatedSearches, ... response.data.result];
                }
            })
    }

    function shuffleArray (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    $scope.reinitSlick = function () {
        $(document).ready(function () {
            $(".available-list-product").slick({
                slidesToShow: 4,
                slidesToScroll: 4,
                autoplay: false,
                autoplaySpeed: 2000,
                infinite: false,
                responsive: [
                    {
                        breakpoint: 880,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            arrows: false,
                        },
                    },
                    {
                        breakpoint: 760,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            arrows: false,
                        },
                    }
                ],
            });
        });
    }

    $scope.buildUrl =  function (url) {
        if (localePrefix) {
            url = '/' + localePrefix + url
        }
        return url;
    }

    $scope.initialize();
})
