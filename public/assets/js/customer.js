(function ()
{
    let desktopCustomerInfo = $('#desktopCustomerStatus');
    let mobileCustomerInfo = $('#mobileCustomerStatus');
    let customerConst = window.customerConst;
    let customer = null;

    const defaultAvartar = '/images/user.svg';

    checkAuth();

    function checkAuth() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                if (document.getElementById('customerStatusLoader')) {
                    document.getElementById('customerStatusLoader').remove();
                }
                let data = JSON.parse(xhttp.responseText);
                if (data.status === 'successful') {
                    customer = data.payload;
                    if (customer.id) { // logged in
                        renderCustomerInfo();
                    }
                } else if (document.getElementById('siginLink')) {
                    document.getElementById('siginLink').style.display = 'block';
                }
            }
        };

        let locale = '';
        if (typeof window.localePrefix !== 'undefined' && window.localePrefix !== '') {
            locale = '/' + window.localePrefix;
        }

        xhttp.open("GET", locale + "/user/check-auth", true);
        xhttp.send();
    }

    function renderCustomerInfo() {
        // desktop
        desktopCustomerInfo.html('');
        desktopCustomerInfo.append(getCustomerInfo(customer));

        // mobile
        mobileCustomerInfo.html('');
        mobileCustomerInfo.append(getCustomerMobileInfo(customer));
    }

    function getCustomerInfo(customer) {

        let avartarUrl = (typeof customer.avartar_url !== 'undefined' && customer.avartar_url) ? customer.avartar_url : defaultAvartar;

        let template = `
        <div class="main-menu-item auth-login-area">
            <div class="user-menu-header flex-b align-c">
                <span class="avatar-icon">
                    <img src="${ avartarUrl }" width="20" height="20">
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="chevron-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
            <div class="user-submenu">
                <ul class="user-submenu-list">
                    <li class="user-menu-item dropdown-area flex-b align-c">
                        <span class="avatar-icon">
                            <img src="${ avartarUrl }">
                        </span>
                        <span class="user-name">${ customer.full_name }</span>
                    </li>
                    <li class="user-menu-item">
                        <a class="user-menu-link" href="${ customerConst.profile_url }">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg>
                            ${ customerConst.user_profile_text }
                        </a>
                    </li>
                    <li class="user-menu-item">
                        <a class="user-menu-link" href="${ customerConst.order_list_url }">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                            </svg>
                            ${ customerConst.order_history_text }
                        </a>
                    </li>
                    <li class="user-menu-item">
                        <a class="user-menu-link" href="${ customerConst.logout_url }" onclick="event.preventDefault(); customerLogout();">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                            </svg>
                            ${ customerConst.logout_text }
                        </a>
                    </li>
                </ul>
                <div class="user-submenu-background"></div>
            </div>
        </div>
        `;

        return $(template);

    }

    function getCustomerMobileInfo() {

        let avartarUrl = (typeof customer.avartar_url !== 'undefined' && customer.avartar_url) ? customer.avartar_url : defaultAvartar;

        let template = `
        <div class="customer-info navigation-box">
            <span class="navigation-link">
                <picture class="is-mobile menu-image">
                    <source media="(min-width: 300px)" srcset="${ avartarUrl }" />
                    <img src="/images/blank.gif" width="40" height="40" />
                </picture>
                <span class="customer-name">${ customer.full_name }</span>
            </span>
        </div>
        <div class="sub-navigation" >
            <ul class="navigation-lev2-list">
                <li class="lev2-item goback-menu goback-lev2menu">
                    <span class="lev2-link">
                        <span class="goback-icon">
                            <img src="/images/svg/arrow-01.svg" title="arrow" alt="arrow">
                        </span>
                        <div class="customer-full-name">${ customer.full_name }</div>
                    </span>
                </li>
                <li class="lev2-item">
                    <a href="${ customerConst.profile_url }" class="lev2-link">
                        <small class="customer-icon portfolio"></small>
                        ${ customerConst.user_profile_text }
                    </a>
                </li>
                <li class="lev2-item">
                    <a href="${ customerConst.order_list_url }" class="lev2-link">
                        <small class="customer-icon history"></small>
                        ${ customerConst.order_history_text }
                    </a>
                </li>
                <li class="lev2-item">
                    <a href="${ customerConst.logout_url }" class="lev2-link" onclick="event.preventDefault(); customerLogout();">
                        <small class="customer-icon logout"></small>
                        ${ customerConst.logout_text }
                    </a>
                </li>
            </ul>
        </div>
        `;

        return $(template);

    }

    window.customerLogout = function() {
        if (document.getElementById('logout-form')) {
            document.getElementById('logout-form').submit();
        } else {
            console.warn('Cannot found form Logout!')
        }
    }

})();
