import { gsap } from 'gsap';

window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const offsetX = 15;
  const offsetY = 15;

  gsap.from(cards, {
    scale: 0.3,
    opacity: 0,
    duration: 1,
    delay: 1
  });

  gsap.registerEffect({
    name: 'defaultMotion',
    effect: (targets: any) => {
      const animation = gsap
        .timeline({
          defaults: {
            ease: 'none',
            duration: 3
          }
        })
        .to(targets, {
          rotateX: offsetX / 2,
          rotateY: offsetY / 2
        })
        .to(targets, {
          rotateY: -offsetY / 2
        })
        .to(targets, {
          rotateX: -offsetX / 2
        })
        .to(targets, {
          rotateY: 0,
          rotateX: 0
        });

      return animation;
    },
    extendTimeline: true
  });

  gsap.registerEffect({
    name: 'move',
    effect: (targets: any, config: any) => {
      const xRotation = config.rotateX ?? 0;
      const yRotation = config.rotateY ?? 0;
      const xShadow = (4 * xRotation) / offsetX;
      const yShadow = (4 * xRotation) / offsetX;

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
    const TL = gsap.timeline();
    const TLDefault = gsap.timeline();
    let defaultMotion = TLDefault.defaultMotion(card, {}) as gsap.core.Timeline;
    defaultMotion.eventCallback('onComplete', () => {
      defaultMotion = TLDefault.defaultMotion(card, {}) as gsap.core.Timeline;
    });

    card?.addEventListener('mouseenter', () => {
      defaultMotion.pause();
    });

    card?.addEventListener('mousemove', (e: any) => {
      const { x, y, width, height } = card.getBoundingClientRect();
      const mouseX = e.clientX - x;
      const mouseY = e.clientY - y;
      const rotateY = getRotation(width, mouseX, offsetX);
      const rotateX = -getRotation(height, mouseY, offsetY);

      TL.clear(true);
      TL.move(card, { rotateX, rotateY, duration: 1.5 });
    });

    card?.addEventListener('mouseleave', () => {
      TL.clear(true);
      TL.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 1.5
      }).eventCallback('onComplete', () => {
        TL.eventCallback('onComplete', () => {});
        defaultMotion.restart();
      });
    });
  });
});

function getRotation(size: number, mousePos: number, offset: number) {
  const K = -offset;
  const a = (2 * offset) / size;

  return a * mousePos + K;
}
