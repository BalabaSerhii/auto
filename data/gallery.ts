/**
 * Галерея та «до/після».
 * ДЕМО: зараз тут стокові фото (Unsplash, вільна ліцензія) — лише для
 * демонстрації. Замініть на реальні фото майстерні та робіт у /public/images/.
 */
export type GalleryItem = {
  src: string | null;
  alt: string;
  caption: string;
  /** Висока (вертикальна) плитка */
  tall?: boolean;
};

export const gallery: GalleryItem[] = [
  { src: "/images/gallery/workshop.jpg", alt: "Робоча зона майстерні з автомобілями на підйомниках", caption: "Робоча зона" },
  { src: "/images/gallery/diagnostics.jpg", alt: "Майстер проводить комп'ютерну діагностику автомобіля", caption: "Комп'ютерна діагностика", tall: true },
  { src: "/images/gallery/engine-check.jpg", alt: "Огляд двигуна під відкритим капотом", caption: "Огляд під капотом" },
  { src: "/images/gallery/lift.jpg", alt: "Огляд автомобіля знизу на підйомнику", caption: "Огляд на підйомнику", tall: true },
  { src: "/images/gallery/workshop-tools.jpg", alt: "Майстерня з інструментом та обладнанням", caption: "Інструмент та обладнання" },
  { src: "/images/gallery/mechanic.jpg", alt: "Майстер працює з автомобілем", caption: "Ремонт", tall: true },
];

export type BeforeAfterItem = {
  /** Коротка назва для вкладки */
  label: string;
  title: string;
  before: string | null;
  after: string | null;
  alt: string;
};

export const beforeAfter: BeforeAfterItem[] = [
  {
    label: "Гальма",
    title: "Заміна гальмівних дисків і колодок",
    before: "/images/before-after/brakes-before.jpg",
    after: "/images/before-after/brakes-after.jpg",
    alt: "Гальмівний диск",
  },
  {
    label: "Фари",
    title: "Відновлення та полірування фар",
    before: "/images/before-after/headlight-before.jpg",
    after: "/images/before-after/headlight-after.jpg",
    alt: "Фара автомобіля",
  },
  {
    label: "Двигун",
    title: "Обслуговування та очищення моторного відсіку",
    before: "/images/before-after/engine-before.jpg",
    after: "/images/before-after/engine-after.jpg",
    alt: "Моторний відсік",
  },
];
