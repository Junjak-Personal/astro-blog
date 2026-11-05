import type { Locale } from '@/i18n';
import * as React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Card, CardContent } from '@/components/ui/card';

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { contentMessages } from '@/i18n/content';
import { useI18n } from '@/i18n/react';

type Props = {
  images: string[];
  locale?: Locale;
};

export function ProjectCarousel({ images, locale }: Props) {
  const { t } = useI18n(locale, contentMessages);
  return (
    <div className="flex justify-center items-center project-carousel" data-no-lightbox>
      <PhotoProvider>
        <Carousel
          locale={locale}
          opts={{
            align: 'start',
          }}
          className="w-[80%]"
        >
          <CarouselContent>
            {images.map((item, index) => (
              <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
                <PhotoView src={item}>

                  <div className="cursor-pointer">
                    <Card>
                      <CardContent className="flex items-center justify-center p-2">
                        <img src={item} alt={t('project-card.image', 'Project image {number}', { number: index + 1 })} className="m-0" />
                      </CardContent>
                    </Card>
                  </div>
                </PhotoView>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots />
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </PhotoProvider>

    </div>

  );
}
