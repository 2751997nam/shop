$(document).ready(function () {

    const MD5 = function (d) {
        var r = M(V(Y(X(d), 8 * d.length)));
        return r.toLowerCase()
    };function M(d){for(var _,m="0123456789ABCDEF",f="",r=0; r<d.length; r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0; m<_.length; m++)_[m]=0;for(m=0; m<8*d.length; m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0; m<32*d.length; m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d, _){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0; n<d.length; n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d, _, m, f, r, i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d, _, m, f, r, i, n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d, _, m, f, r, i, n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d, _, m, f, r, i, n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d, _, m, f, r, i, n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d, _){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d, _){return d<<_|d>>>32-_}

    $('.wholesale-slider').slick({
        slidesToShow: 1,
        autoplaySpeed: 7000,
        infinite: false,
        dots: true,
        arrows: false,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 7000,
    });

    $('.find-answers').click(function () {
        $('html, body').animate({ scrollTop: $("#faqs-wrapper").offset().top - 30 }, 1000);
    })

    /* $('.wholesale-request-form').on('change', '.file-upload-field', function () {
        $(this).prev().find('.wholesale-input-text').text(this.files.length + " file(s) selected");
        // $(this).prev().find('.wholesale-input-text').text($(this).val().replace(/.*(\/|\\)/, '') );
    }); */

    // $('.upload-file-label').length

    var isValidated = false;

    if ($('.wholesale-error').is(':visible') == true) {
        $(this).next().addClass('error-input')
    };

    $('.panel-head').click(function () {
        $(this).toggleClass('faq-head-active')
        $(this).next().slideToggle();
    })

    $('.wholesale-input').on('change', function () {
        wholesaleValidate($(this));
    })

    toastr.options.positionClass = "toast-bottom-center";

    function wholesaleValidate(element = false) {
        let quantityInput = $('#quantity.wholesale-input');
        let requestedInput = $('#requested.wholesale-input');
        let nameInput = $('#your-name.wholesale-input');
        let emailInput = $('#your-email.wholesale-input');

        isValidated = true;

        let notEmptyValidate = [requestedInput, nameInput];

        if (!element || (element.attr('id') == quantityInput.attr('id'))) {
            quantityInput.parent().find('.wholesale-error').hide();
            if (!quantityInput.val() || (quantityInput.val() && quantityInput.val() < 50)) {
                quantityInput.parent().find('.wholesale-error').show();
                isValidated = false;
            }
        }

        if (!element || (element.attr('id') == emailInput.attr('id'))) {
            emailInput.parent().find('.wholesale-error').hide();
            if (!emailInput.val() || (emailInput.val() && !validateEmail(emailInput.val()))) {
                emailInput.parent().find('.wholesale-error').show();
                isValidated = false;
            }
        }

        notEmptyValidate.forEach(el => {
            if (!element || (element.attr('id') == el.attr('id'))) {
                el.parent().find('.wholesale-error').hide();
                if (!el.val()) {
                    el.parent().find('.wholesale-error').show();
                    isValidated = false;
                }
            }
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    var uploadImagesDesigns = [];
    $(".file-upload-field.wholesale-input").on("change", function (e) {
        var files = e.currentTarget.files;
        var input = $(this);

        if (files.length) {
            let uploadFiles = [];
            for (let i = 0; i < files.length; i++) {

                var filesize = ((files[i].size / 1024) / 1024).toFixed(4);
                let validExtention = false;
                if (['png', 'jpg', 'jpeg', 'gif', 'pdf', 'psd'].includes(files[i].name.split('.').pop())) {
                    validExtention = true;
                }

                if (filesize > 10 || !validExtention) {
                    toastr.warning(input.data('warning'));
                } else {
                    uploadFiles.push(files[i]);
                }
            }
            uploadFile(uploadFiles, input);
        }

    });

    function uploadFile(files, input) {

        $('#wholesaleSubmit').attr('disabled', true);
        $('#wholesaleSubmit').css('opacity', 0.5);

        if (uploadImagesDesigns.length + files.length > 5) {
            toastr.warning(input.data('manyfiles'));
            return;
        }

        var formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("upload[]", files[i]);
        }

        var request = new XMLHttpRequest();
        request.open("POST", "/upload");
        request.onload = function (e) {
            var res = JSON.parse(this.responseText);
            if (typeof res.upload != 'undefined') {
                uploadImagesDesigns = uploadImagesDesigns.concat(res.upload);
            }
            renderPreviewImages();
            $('#wholesaleSubmit').removeAttr('disabled');
            $('#wholesaleSubmit').css('opacity', 1);
        };
        request.send(formData);
    }

    function renderPreviewImages() {
        let html = '';
        for (let i = 0; i < uploadImagesDesigns.length; i++) {
            let src = uploadImagesDesigns[i];
            html += `<span class="sb_image">
                        <img class="comment-image" height="58px" src="${src}">
                        <button data-index="${i}" type="button" name="button" class="button image-remove">×</button>
                    </span>`;
        }
        $(".file-upload-field.wholesale-input").val('');
        $('.image-contrainer').html(html);
    }

    $(document).on('click', '.image-remove', function () {
        uploadImagesDesigns.splice($(this).data('index'), 1);
        renderPreviewImages();
    });

    $(document).on('click', '#wholesaleSubmit', function () {
        let button = $(this);
        wholesaleValidate();
        if (isValidated) {

            let quantityInput = $('#quantity.wholesale-input');
            let requestedInput = $('#requested.wholesale-input');
            let nameInput = $('#your-name.wholesale-input');
            let emailInput = $('#your-email.wholesale-input');

            let companyInput = $('#your-company.wholesale-input');
            let numberInput = $('#your-number-item.wholesale-input');

            let wholesaleData = {
                "Quantity of products required": quantityInput.val(),
                "Products requested": requestedInput.val(),
                "Name": nameInput.val(),
                "Email": emailInput.val(),
                "Company/Organization": companyInput.val(),
                "Phone": numberInput.val(),
                "Design": uploadImagesDesigns
            }

            wholesaleData = "Quantity of products required: " + quantityInput.val() + "\n\n";
            wholesaleData += "Products requested: \n" + requestedInput.val() + "\n\n";
            wholesaleData += "Name: " + nameInput.val() + "\n";
            wholesaleData += "Email: " + emailInput.val() + "\n";
            wholesaleData += "Company/Organization: " + companyInput.val() + "\n";
            wholesaleData += "Phone: " + numberInput.val() + "\n\n";
            wholesaleData += "Design: \n" + uploadImagesDesigns.join("\n");

            let order = {
                "name": "Wholesale",
                "phone": '(510) 991-2545',
                "country": "Viet Nam",
                "city_name": "Ha Noi",
                "state_name": "Dong Bang Song Hong",
                "email": "support@printerval.com",
                "note": wholesaleData,
                "address": "6 Le Van Thiem",
                "payment_type": "COD",
                "shipping_type": "standard",
            }

            let time = Date.now().toString();

            let ticketOrder = {
                content: wholesaleData,
                customer_name: nameInput.val(),
                email: emailInput.val(),
                status: 'open',
                title: 'Wholesale',
                token_customer: MD5(emailInput.val()),
                token_ticket: MD5(time),
                type: 'bulk_order',
                from: 'customer',
            };

            $.ajax({
                method: "POST",
                dataType: 'json',
                // url: apiUrl + "/api/simple-order",
                url: window.ticketSaveUrl,
                contentType: 'application/json',
                data: JSON.stringify(ticketOrder)
            }).done(function (response) {
                if(response.status === 'successful') {
                    toastr.success(button.data('thanks'));
                    $('.wholesale-input').val('');
                    uploadImagesDesigns = [];
                    renderPreviewImages();
                } else {
                    toastr.success(button.data('error'));
                }
            });
        }
    })

});
