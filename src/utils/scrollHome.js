export function scrollHomeTo(id) {
  const scroller = document.querySelector('.home-scroller');
  const target = document.getElementById(id);
  if (!scroller || !target) return;
  const left = target.offsetLeft - scroller.offsetLeft;
  scroller.scrollTo({ left, behavior: 'smooth' });
}
