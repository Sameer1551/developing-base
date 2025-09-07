import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enHero from './locales/en/hero.json';
import enLogin from './locales/en/login.json';
import enReport from './locales/en/report.json';
import enAlerts from './locales/en/alerts.json';
import enAwareness from './locales/en/awareness.json';
import enWaterQuality from './locales/en/waterQuality.json';
import enDashboard from './locales/en/dashboard.json';
import enFooter from './locales/en/footer.json';

import hiCommon from './locales/hi/common.json';
import hiNavigation from './locales/hi/navigation.json';
import hiHero from './locales/hi/hero.json';
import hiLogin from './locales/hi/login.json';
import hiReport from './locales/hi/report.json';
import hiAlerts from './locales/hi/alerts.json';
import hiAwareness from './locales/hi/awareness.json';
import hiWaterQuality from './locales/hi/waterQuality.json';
import hiDashboard from './locales/hi/dashboard.json';
import hiFooter from './locales/hi/footer.json';

import asCommon from './locales/as/common.json';
import asNavigation from './locales/as/navigation.json';
import asHero from './locales/as/hero.json';
import asLogin from './locales/as/login.json';
import asReport from './locales/as/report.json';
import asAlerts from './locales/as/alerts.json';
import asAwareness from './locales/as/awareness.json';
import asWaterQuality from './locales/as/waterQuality.json';
import asDashboard from './locales/as/dashboard.json';
import asFooter from './locales/as/footer.json';

// Import all other language files
import bodoCommon from './locales/bodo/common.json';
import bodoNavigation from './locales/bodo/navigation.json';
import bodoHero from './locales/bodo/hero.json';
import bodoLogin from './locales/bodo/login.json';
import bodoReport from './locales/bodo/report.json';
import bodoAlerts from './locales/bodo/alerts.json';
import bodoAwareness from './locales/bodo/awareness.json';
import bodoWaterQuality from './locales/bodo/waterQuality.json';
import bodoDashboard from './locales/bodo/dashboard.json';
import bodoFooter from './locales/bodo/footer.json';

import karbiCommon from './locales/karbi/common.json';
import karbiNavigation from './locales/karbi/navigation.json';
import karbiHero from './locales/karbi/hero.json';
import karbiLogin from './locales/karbi/login.json';
import karbiReport from './locales/karbi/report.json';
import karbiAlerts from './locales/karbi/alerts.json';
import karbiAwareness from './locales/karbi/awareness.json';
import karbiWaterQuality from './locales/karbi/waterQuality.json';
import karbiDashboard from './locales/karbi/dashboard.json';
import karbiFooter from './locales/karbi/footer.json';

import mishingCommon from './locales/mishing/common.json';
import mishingNavigation from './locales/mishing/navigation.json';
import mishingHero from './locales/mishing/hero.json';
import mishingLogin from './locales/mishing/login.json';
import mishingReport from './locales/mishing/report.json';
import mishingAlerts from './locales/mishing/alerts.json';
import mishingAwareness from './locales/mishing/awareness.json';
import mishingWaterQuality from './locales/mishing/waterQuality.json';
import mishingDashboard from './locales/mishing/dashboard.json';
import mishingFooter from './locales/mishing/footer.json';

import mniCommon from './locales/mni/common.json';
import mniNavigation from './locales/mni/navigation.json';
import mniHero from './locales/mni/hero.json';
import mniLogin from './locales/mni/login.json';
import mniReport from './locales/mni/report.json';
import mniAlerts from './locales/mni/alerts.json';
import mniAwareness from './locales/mni/awareness.json';
import mniWaterQuality from './locales/mni/waterQuality.json';
import mniDashboard from './locales/mni/dashboard.json';
import mniFooter from './locales/mni/footer.json';

import khasiCommon from './locales/khasi/common.json';
import khasiNavigation from './locales/khasi/navigation.json';
import khasiHero from './locales/khasi/hero.json';
import khasiLogin from './locales/khasi/login.json';
import khasiReport from './locales/khasi/report.json';
import khasiAlerts from './locales/khasi/alerts.json';
import khasiAwareness from './locales/khasi/awareness.json';
import khasiWaterQuality from './locales/khasi/waterQuality.json';
import khasiDashboard from './locales/khasi/dashboard.json';
import khasiFooter from './locales/khasi/footer.json';

import garoCommon from './locales/garo/common.json';
import garoNavigation from './locales/garo/navigation.json';
import garoHero from './locales/garo/hero.json';
import garoLogin from './locales/garo/login.json';
import garoReport from './locales/garo/report.json';
import garoAlerts from './locales/garo/alerts.json';
import garoAwareness from './locales/garo/awareness.json';
import garoWaterQuality from './locales/garo/waterQuality.json';
import garoDashboard from './locales/garo/dashboard.json';
import garoFooter from './locales/garo/footer.json';

import jaintiaCommon from './locales/jaintia/common.json';
import jaintiaNavigation from './locales/jaintia/navigation.json';
import jaintiaHero from './locales/jaintia/hero.json';
import jaintiaLogin from './locales/jaintia/login.json';
import jaintiaReport from './locales/jaintia/report.json';
import jaintiaAlerts from './locales/jaintia/alerts.json';
import jaintiaAwareness from './locales/jaintia/awareness.json';
import jaintiaWaterQuality from './locales/jaintia/waterQuality.json';
import jaintiaDashboard from './locales/jaintia/dashboard.json';
import jaintiaFooter from './locales/jaintia/footer.json';

import mizoCommon from './locales/mizo/common.json';
import mizoNavigation from './locales/mizo/navigation.json';
import mizoHero from './locales/mizo/hero.json';
import mizoLogin from './locales/mizo/login.json';
import mizoReport from './locales/mizo/report.json';
import mizoAlerts from './locales/mizo/alerts.json';
import mizoAwareness from './locales/mizo/awareness.json';
import mizoWaterQuality from './locales/mizo/waterQuality.json';
import mizoDashboard from './locales/mizo/dashboard.json';
import mizoFooter from './locales/mizo/footer.json';

import nagameseCommon from './locales/nagamese/common.json';
import nagameseNavigation from './locales/nagamese/navigation.json';
import nagameseHero from './locales/nagamese/hero.json';
import nagameseLogin from './locales/nagamese/login.json';
import nagameseReport from './locales/nagamese/report.json';
import nagameseAlerts from './locales/nagamese/alerts.json';
import nagameseAwareness from './locales/nagamese/awareness.json';
import nagameseWaterQuality from './locales/nagamese/waterQuality.json';
import nagameseDashboard from './locales/nagamese/dashboard.json';
import nagameseFooter from './locales/nagamese/footer.json';

import aoCommon from './locales/ao/common.json';
import aoNavigation from './locales/ao/navigation.json';
import aoHero from './locales/ao/hero.json';
import aoLogin from './locales/ao/login.json';
import aoReport from './locales/ao/report.json';
import aoAlerts from './locales/ao/alerts.json';
import aoAwareness from './locales/ao/awareness.json';
import aoWaterQuality from './locales/ao/waterQuality.json';
import aoDashboard from './locales/ao/dashboard.json';
import aoFooter from './locales/ao/footer.json';

import angamiCommon from './locales/angami/common.json';
import angamiNavigation from './locales/angami/navigation.json';
import angamiHero from './locales/angami/hero.json';
import angamiLogin from './locales/angami/login.json';
import angamiReport from './locales/angami/report.json';
import angamiAlerts from './locales/angami/alerts.json';
import angamiAwareness from './locales/angami/awareness.json';
import angamiWaterQuality from './locales/angami/waterQuality.json';
import angamiDashboard from './locales/angami/dashboard.json';
import angamiFooter from './locales/angami/footer.json';

import semaCommon from './locales/sema/common.json';
import semaNavigation from './locales/sema/navigation.json';
import semaHero from './locales/sema/hero.json';
import semaLogin from './locales/sema/login.json';
import semaReport from './locales/sema/report.json';
import semaAlerts from './locales/sema/alerts.json';
import semaAwareness from './locales/sema/awareness.json';
import semaWaterQuality from './locales/sema/waterQuality.json';
import semaDashboard from './locales/sema/dashboard.json';
import semaFooter from './locales/sema/footer.json';

import lothaCommon from './locales/lotha/common.json';
import lothaNavigation from './locales/lotha/navigation.json';
import lothaHero from './locales/lotha/hero.json';
import lothaLogin from './locales/lotha/login.json';
import lothaReport from './locales/lotha/report.json';
import lothaAlerts from './locales/lotha/alerts.json';
import lothaAwareness from './locales/lotha/awareness.json';
import lothaWaterQuality from './locales/lotha/waterQuality.json';
import lothaDashboard from './locales/lotha/dashboard.json';
import lothaFooter from './locales/lotha/footer.json';

import nyishiCommon from './locales/nyishi/common.json';
import nyishiNavigation from './locales/nyishi/navigation.json';
import nyishiHero from './locales/nyishi/hero.json';
import nyishiLogin from './locales/nyishi/login.json';
import nyishiReport from './locales/nyishi/report.json';
import nyishiAlerts from './locales/nyishi/alerts.json';
import nyishiAwareness from './locales/nyishi/awareness.json';
import nyishiWaterQuality from './locales/nyishi/waterQuality.json';
import nyishiDashboard from './locales/nyishi/dashboard.json';
import nyishiFooter from './locales/nyishi/footer.json';

import apataniCommon from './locales/apatani/common.json';
import apataniNavigation from './locales/apatani/navigation.json';
import apataniHero from './locales/apatani/hero.json';
import apataniLogin from './locales/apatani/login.json';
import apataniReport from './locales/apatani/report.json';
import apataniAlerts from './locales/apatani/alerts.json';
import apataniAwareness from './locales/apatani/awareness.json';
import apataniWaterQuality from './locales/apatani/waterQuality.json';
import apataniDashboard from './locales/apatani/dashboard.json';
import apataniFooter from './locales/apatani/footer.json';

import adiCommon from './locales/adi/common.json';
import adiNavigation from './locales/adi/navigation.json';
import adiHero from './locales/adi/hero.json';
import adiLogin from './locales/adi/login.json';
import adiReport from './locales/adi/report.json';
import adiAlerts from './locales/adi/alerts.json';
import adiAwareness from './locales/adi/awareness.json';
import adiWaterQuality from './locales/adi/waterQuality.json';
import adiDashboard from './locales/adi/dashboard.json';
import adiFooter from './locales/adi/footer.json';

import mishmiCommon from './locales/mishmi/common.json';
import mishmiNavigation from './locales/mishmi/navigation.json';
import mishmiHero from './locales/mishmi/hero.json';
import mishmiLogin from './locales/mishmi/login.json';
import mishmiReport from './locales/mishmi/report.json';
import mishmiAlerts from './locales/mishmi/alerts.json';
import mishmiAwareness from './locales/mishmi/awareness.json';
import mishmiWaterQuality from './locales/mishmi/waterQuality.json';
import mishmiDashboard from './locales/mishmi/dashboard.json';
import mishmiFooter from './locales/mishmi/footer.json';

import monpaCommon from './locales/monpa/common.json';
import monpaNavigation from './locales/monpa/navigation.json';
import monpaHero from './locales/monpa/hero.json';
import monpaLogin from './locales/monpa/login.json';
import monpaReport from './locales/monpa/report.json';
import monpaAlerts from './locales/monpa/alerts.json';
import monpaAwareness from './locales/monpa/awareness.json';
import monpaWaterQuality from './locales/monpa/waterQuality.json';
import monpaDashboard from './locales/monpa/dashboard.json';
import monpaFooter from './locales/monpa/footer.json';

import tripuriCommon from './locales/tripuri/common.json';
import tripuriNavigation from './locales/tripuri/navigation.json';
import tripuriHero from './locales/tripuri/hero.json';
import tripuriLogin from './locales/tripuri/login.json';
import tripuriReport from './locales/tripuri/report.json';
import tripuriAlerts from './locales/tripuri/alerts.json';
import tripuriAwareness from './locales/tripuri/awareness.json';
import tripuriWaterQuality from './locales/tripuri/waterQuality.json';
import tripuriDashboard from './locales/tripuri/dashboard.json';
import tripuriFooter from './locales/tripuri/footer.json';

import kokborokCommon from './locales/kokborok/common.json';
import kokborokNavigation from './locales/kokborok/navigation.json';
import kokborokHero from './locales/kokborok/hero.json';
import kokborokLogin from './locales/kokborok/login.json';
import kokborokReport from './locales/kokborok/report.json';
import kokborokAlerts from './locales/kokborok/alerts.json';
import kokborokAwareness from './locales/kokborok/awareness.json';
import kokborokWaterQuality from './locales/kokborok/waterQuality.json';
import kokborokDashboard from './locales/kokborok/dashboard.json';
import kokborokFooter from './locales/kokborok/footer.json';

import bnCommon from './locales/bn/common.json';
import bnNavigation from './locales/bn/navigation.json';
import bnHero from './locales/bn/hero.json';
import bnLogin from './locales/bn/login.json';
import bnReport from './locales/bn/report.json';
import bnAlerts from './locales/bn/alerts.json';
import bnAwareness from './locales/bn/awareness.json';
import bnWaterQuality from './locales/bn/waterQuality.json';
import bnDashboard from './locales/bn/dashboard.json';
import bnFooter from './locales/bn/footer.json';

import neCommon from './locales/ne/common.json';
import neNavigation from './locales/ne/navigation.json';
import neHero from './locales/ne/hero.json';
import neLogin from './locales/ne/login.json';
import neReport from './locales/ne/report.json';
import neAlerts from './locales/ne/alerts.json';
import neAwareness from './locales/ne/awareness.json';
import neWaterQuality from './locales/ne/waterQuality.json';
import neDashboard from './locales/ne/dashboard.json';
import neFooter from './locales/ne/footer.json';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    hero: enHero,
    login: enLogin,
    report: enReport,
    alerts: enAlerts,
    awareness: enAwareness,
    waterQuality: enWaterQuality,
    dashboard: enDashboard,
    footer: enFooter,
  },
  hi: {
    common: hiCommon,
    navigation: hiNavigation,
    hero: hiHero,
    login: hiLogin,
    report: hiReport,
    alerts: hiAlerts,
    awareness: hiAwareness,
    waterQuality: hiWaterQuality,
    dashboard: hiDashboard,
    footer: hiFooter,
  },
  as: {
    common: asCommon,
    navigation: asNavigation,
    hero: asHero,
    login: asLogin,
    report: asReport,
    alerts: asAlerts,
    awareness: asAwareness,
    waterQuality: asWaterQuality,
    dashboard: asDashboard,
    footer: asFooter,
  },
  bodo: {
    common: bodoCommon,
    navigation: bodoNavigation,
    hero: bodoHero,
    login: bodoLogin,
    report: bodoReport,
    alerts: bodoAlerts,
    awareness: bodoAwareness,
    waterQuality: bodoWaterQuality,
    dashboard: bodoDashboard,
    footer: bodoFooter,
  },
  karbi: {
    common: karbiCommon,
    navigation: karbiNavigation,
    hero: karbiHero,
    login: karbiLogin,
    report: karbiReport,
    alerts: karbiAlerts,
    awareness: karbiAwareness,
    waterQuality: karbiWaterQuality,
    dashboard: karbiDashboard,
    footer: karbiFooter,
  },
  mishing: {
    common: mishingCommon,
    navigation: mishingNavigation,
    hero: mishingHero,
    login: mishingLogin,
    report: mishingReport,
    alerts: mishingAlerts,
    awareness: mishingAwareness,
    waterQuality: mishingWaterQuality,
    dashboard: mishingDashboard,
    footer: mishingFooter,
  },
  mni: {
    common: mniCommon,
    navigation: mniNavigation,
    hero: mniHero,
    login: mniLogin,
    report: mniReport,
    alerts: mniAlerts,
    awareness: mniAwareness,
    waterQuality: mniWaterQuality,
    dashboard: mniDashboard,
    footer: mniFooter,
  },
  khasi: {
    common: khasiCommon,
    navigation: khasiNavigation,
    hero: khasiHero,
    login: khasiLogin,
    report: khasiReport,
    alerts: khasiAlerts,
    awareness: khasiAwareness,
    waterQuality: khasiWaterQuality,
    dashboard: khasiDashboard,
    footer: khasiFooter,
  },
  garo: {
    common: garoCommon,
    navigation: garoNavigation,
    hero: garoHero,
    login: garoLogin,
    report: garoReport,
    alerts: garoAlerts,
    awareness: garoAwareness,
    waterQuality: garoWaterQuality,
    dashboard: garoDashboard,
    footer: garoFooter,
  },
  jaintia: {
    common: jaintiaCommon,
    navigation: jaintiaNavigation,
    hero: jaintiaHero,
    login: jaintiaLogin,
    report: jaintiaReport,
    alerts: jaintiaAlerts,
    awareness: jaintiaAwareness,
    waterQuality: jaintiaWaterQuality,
    dashboard: jaintiaDashboard,
    footer: jaintiaFooter,
  },
  mizo: {
    common: mizoCommon,
    navigation: mizoNavigation,
    hero: mizoHero,
    login: mizoLogin,
    report: mizoReport,
    alerts: mizoAlerts,
    awareness: mizoAwareness,
    waterQuality: mizoWaterQuality,
    dashboard: mizoDashboard,
    footer: mizoFooter,
  },
  nagamese: {
    common: nagameseCommon,
    navigation: nagameseNavigation,
    hero: nagameseHero,
    login: nagameseLogin,
    report: nagameseReport,
    alerts: nagameseAlerts,
    awareness: nagameseAwareness,
    waterQuality: nagameseWaterQuality,
    dashboard: nagameseDashboard,
    footer: nagameseFooter,
  },
  ao: {
    common: aoCommon,
    navigation: aoNavigation,
    hero: aoHero,
    login: aoLogin,
    report: aoReport,
    alerts: aoAlerts,
    awareness: aoAwareness,
    waterQuality: aoWaterQuality,
    dashboard: aoDashboard,
    footer: aoFooter,
  },
  angami: {
    common: angamiCommon,
    navigation: angamiNavigation,
    hero: angamiHero,
    login: angamiLogin,
    report: angamiReport,
    alerts: angamiAlerts,
    awareness: angamiAwareness,
    waterQuality: angamiWaterQuality,
    dashboard: angamiDashboard,
    footer: angamiFooter,
  },
  sema: {
    common: semaCommon,
    navigation: semaNavigation,
    hero: semaHero,
    login: semaLogin,
    report: semaReport,
    alerts: semaAlerts,
    awareness: semaAwareness,
    waterQuality: semaWaterQuality,
    dashboard: semaDashboard,
    footer: semaFooter,
  },
  lotha: {
    common: lothaCommon,
    navigation: lothaNavigation,
    hero: lothaHero,
    login: lothaLogin,
    report: lothaReport,
    alerts: lothaAlerts,
    awareness: lothaAwareness,
    waterQuality: lothaWaterQuality,
    dashboard: lothaDashboard,
    footer: lothaFooter,
  },
  nyishi: {
    common: nyishiCommon,
    navigation: nyishiNavigation,
    hero: nyishiHero,
    login: nyishiLogin,
    report: nyishiReport,
    alerts: nyishiAlerts,
    awareness: nyishiAwareness,
    waterQuality: nyishiWaterQuality,
    dashboard: nyishiDashboard,
    footer: nyishiFooter,
  },
  apatani: {
    common: apataniCommon,
    navigation: apataniNavigation,
    hero: apataniHero,
    login: apataniLogin,
    report: apataniReport,
    alerts: apataniAlerts,
    awareness: apataniAwareness,
    waterQuality: apataniWaterQuality,
    dashboard: apataniDashboard,
    footer: apataniFooter,
  },
  adi: {
    common: adiCommon,
    navigation: adiNavigation,
    hero: adiHero,
    login: adiLogin,
    report: adiReport,
    alerts: adiAlerts,
    awareness: adiAwareness,
    waterQuality: adiWaterQuality,
    dashboard: adiDashboard,
    footer: adiFooter,
  },
  mishmi: {
    common: mishmiCommon,
    navigation: mishmiNavigation,
    hero: mishmiHero,
    login: mishmiLogin,
    report: mishmiReport,
    alerts: mishmiAlerts,
    awareness: mishmiAwareness,
    waterQuality: mishmiWaterQuality,
    dashboard: mishmiDashboard,
    footer: mishmiFooter,
  },
  monpa: {
    common: monpaCommon,
    navigation: monpaNavigation,
    hero: monpaHero,
    login: monpaLogin,
    report: monpaReport,
    alerts: monpaAlerts,
    awareness: monpaAwareness,
    waterQuality: monpaWaterQuality,
    dashboard: monpaDashboard,
    footer: monpaFooter,
  },
  tripuri: {
    common: tripuriCommon,
    navigation: tripuriNavigation,
    hero: tripuriHero,
    login: tripuriLogin,
    report: tripuriReport,
    alerts: tripuriAlerts,
    awareness: tripuriAwareness,
    waterQuality: tripuriWaterQuality,
    dashboard: tripuriDashboard,
    footer: tripuriFooter,
  },
  kokborok: {
    common: kokborokCommon,
    navigation: kokborokNavigation,
    hero: kokborokHero,
    login: kokborokLogin,
    report: kokborokReport,
    alerts: kokborokAlerts,
    awareness: kokborokAwareness,
    waterQuality: kokborokWaterQuality,
    dashboard: kokborokDashboard,
    footer: kokborokFooter,
  },
  bn: {
    common: bnCommon,
    navigation: bnNavigation,
    hero: bnHero,
    login: bnLogin,
    report: bnReport,
    alerts: bnAlerts,
    awareness: bnAwareness,
    waterQuality: bnWaterQuality,
    dashboard: bnDashboard,
    footer: bnFooter,
  },
  ne: {
    common: neCommon,
    navigation: neNavigation,
    hero: neHero,
    login: neLogin,
    report: neReport,
    alerts: neAlerts,
    awareness: neAwareness,
    waterQuality: neWaterQuality,
    dashboard: neDashboard,
    footer: neFooter,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
