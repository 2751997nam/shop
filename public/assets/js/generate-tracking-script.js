document.addEventListener('DOMContentLoaded', () => {
	/** init gtm after 3500 seconds - this could be adjusted */
	setTimeout(initGTM, 10000);
});
document.addEventListener('scroll', initGTMOnEvent);
document.addEventListener('mousemove', initGTMOnEvent);
document.addEventListener('touchstart', initGTMOnEvent);

function initGTMOnEvent (event) {
	initGTM();
	event.currentTarget.removeEventListener(event.type, initGTMOnEvent); // remove the event listener that got triggered
}

function initGTM () {
	if (window.gtmDidInit) {
		return false;
	}
	window.gtmDidInit = true; // flag to ensure script does not get added to DOM more than once.
	var script = document.createElement("script");
	script.innerHTML = "dataLayer.push({'google_tag_params':google_tag_params });";
	document.head.appendChild(script);
	var script2 = document.createElement("script");
	script2.innerHTML = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NJ5F8SF');";
	document.head.appendChild(script2);
}