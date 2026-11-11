export function scrollHomeTo(id) {
  const scroller = document.querySelector('.home-scroller');
  const target = document.getElementById(id);
  if (!scroller || !target) return;
  const top =
    target.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop;
  scroller.scrollTo({ top, behavior: 'smooth' });
}
