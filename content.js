const replaceLogos = () => {
    const images = document.querySelectorAll('img[src*="google.com/images/branding/"], div[class*="logo"], div[id*="logo"], img[class*="logo"], img[id*="logo"], img[class*="lnXdpd"]');
    images.forEach((img) => {
      img.src = chrome.runtime.getURL('logo.png');
    });
    const divs = document.querySelectorAll('div[class*="logo"], div[id*="logo"]');
    divs.forEach((div) => {
      const style = div.style.backgroundImage;
      if (style && style.includes('google.com/images/branding/')) {
        div.style.backgroundImage = `url(${chrome.runtime.getURL('logo.png')})`;
      }
    });
  
    const svgs = document.querySelectorAll('svg[class*="logo"], svg[id*="logo"]');
    svgs.forEach((svg) => {
      const imagesInSvg = svg.querySelectorAll('image');
      imagesInSvg.forEach((image) => {
        if (image.href.baseVal.includes('google.com/images/branding/')) {
          image.href.baseVal = chrome.runtime.getURL('logo.png');
        }
      });
    });
  };
  
  window.addEventListener('DOMContentLoaded', replaceLogos);
  
  const observer = new MutationObserver(replaceLogos);
  observer.observe(document.body, { childList: true, subtree: true });
  