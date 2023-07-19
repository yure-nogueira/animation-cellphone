import { gsap } from 'gsap';

window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const TL = gsap.timeline();
  const min = -15;
  const max = 15;
  const randomValue = () => Math.floor(Math.random() * (max - min + 1)) + min;

  gsap.from(cards, {
    scale: 0.3,
    opacity: 0,
    duration: 1,
    delay: 1
  });

  gsap.registerEffect({
    name: 'move',
    effect: (targets: any, config: any) => {
      const xRotation = randomValue();
      const yRotation = randomValue();
      const xShadow = (4 * xRotation) / max;
      const yShadow = (4 * xRotation) / max;

      return gsap.to(targets, {
        duration: config.duration,
        rotateX: xRotation,
        rotateY: yRotation,
        boxShadow: `${xShadow}px ${yShadow}px ${xShadow + yShadow} 0 #303030`
      });
    },
    defaults: { duration: 1 },
    extendTimeline: true
  });

  cards.forEach((card) => {
    let locked = false;

    card?.addEventListener('mousemove', () => {
      const rect = card.getBoundingClientRect();
      console.log(rect);

      if (locked) return;
      locked = true;
      setTimeout(() => {
        locked = false;
      }, 1000);

      TL.clear();
      TL.move(card, { duration: 1.5 });
    });
  });
});
