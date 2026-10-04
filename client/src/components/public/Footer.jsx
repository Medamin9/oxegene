import React from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';

function Footer() {
  const { data } = useQuery('content', api.getContent);
  const footerContent = data?.content?.footer || {};
  const contactContent = data?.content?.contact || {};

  return (
    <footer className="w-full bg-surface-container-lowest py-space-xl mt-space-xl shadow-[0_-8px_32px_rgba(0,0,0,0.50)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl">
        <div className="space-y-space-md">
          <div className="flex items-center gap-space-sm">
            <img
              alt="Oxegene Coffee Logo"
              className="h-7 w-auto object-contain"
              src="./logob.png"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Oxegene
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {footerContent.description}
          </p>
          <div className="flex items-center gap-space-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">local_cafe</span>
            <span className="font-label-sm text-label-sm">Préparé avec des grains d'origine unique</span>
          </div>
        </div>

        <div className="space-y-space-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Horaires & Lounge
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
            {contactContent.hours}
          </p>
          <p className="font-label-md text-label-md text-secondary">
            {contactContent.twilightRituals}
          </p>
        </div>

        <div className="space-y-space-sm">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Localisation
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
            {contactContent.address}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {contactContent.phone}
          </p>
        </div>

        <div className="space-y-space-md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Réseaux
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {footerContent.socialDescription}
          </p>
          <div className="flex items-center gap-space-md">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-space-xl pt-space-lg flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
        <p>{footerContent.copyright}</p>
        <p className="mt-2 sm:mt-0">
          Développé par{' '}
          <a
            href="https://mohamedaminedev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors font-semibold"
          >
            MA Solutions
          </a>
        </p>
        <p className="mt-2 sm:mt-0">{footerContent.tagline}</p>
      </div>
    </footer>
  );
}

export default Footer;
