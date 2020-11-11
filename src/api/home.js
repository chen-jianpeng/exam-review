export const getData = data => {
  return new Promise(r => {
    setTimeout(() => {
      r({ data });
    }, 1000);
  });
};
