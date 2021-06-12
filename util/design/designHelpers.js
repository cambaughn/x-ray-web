const isMobile = () => {
  console.log('inner width ', window.innerWidth);
  return window.innerWidth < 1024;
}


export { isMobile }
