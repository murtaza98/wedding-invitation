// ─────────────────────────────────────────────────────────────────────────────
//  Wedding content — edit everything here. Components read from this file only.
//  Nothing below requires touching the React code to change names, dates, venues.
// ─────────────────────────────────────────────────────────────────────────────

const base = import.meta.env.BASE_URL

export const config = {
  // Shown on the envelope seal and used for the browser tab.
  initials: 'S & M',

  envelope: {
    image: base + 'envelope.png',
    video: base + 'envelope-open.mp4',
  },

  // The arched-balcony opening screen.
  hero: {
    names: 'Sakina & Murtaza',
    tagline: 'are getting married!',
    place: '',
  },

  // The formal invitation panel.
  invitation: {
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',

    blessing: [
      'By the grace of Allah, Vasilla-E-Panjatan Pak (AS), Aimmat Tahereen (AS),',
      'Duat Mutlaqeen (RA) and with the blessings of our moula',
      'Al-Hayyul Muqqaddas Dr. Syedna Mohammed Burhanuddin (RA)',
      'and his holiness Dr. Syedna Aliqaddar Muffadal Saifuddin (TUS)',
    ],

    invitingParents: 'Mr Murtaza & Mrs Durriya Lalipurwala',
    invitingLine: 'Cordially invite you to grace the Auspicious and joyous Wedding Occasion of their loving daughter',

    groom: 'Murtaza',
    groomLineage: 'S/O Mr Taher & Mrs Maleka Patrawala',
    connector: 'weds',
    bride: 'Sakina',

    regardsLabel: 'With the best wishes of',
    regardsNames: 'Lalipurwala & Madraswala family',
    libas: 'Kindly grace your presence in libas ul anwar',
  },

  // The scratch-to-reveal panel.
  scratch: {
    eyebrow: 'Scratch to reveal',
    title: 'The Dates',
    foilLabel: 'Scratch here',
    revealButton: 'Reveal the dates',
    display: '25th – 28th\nMarch 2027',
  },

  // The four celebrations.
  eventsTitle: 'The Celebrations',
  events: [
    {
      name: 'Mehandi',
      weekday: 'Thursday',
      venue: 'Bandra',
      area: 'Mumbai',
      date: '25 March 2027',
      time: '7:00 PM',
      hijri: '18th Shawwal-ul-Mukarram',
    },
    {
      name: 'Nikah',
      weekday: 'Friday',
      venue: 'Zaini Masjid',
      area: 'Kurla West, Mumbai',
      date: '26 March 2027',
      time: '7:00 PM',
      hijri: '19th Shawwal-ul-Mukarram',
    },
    {
      name: 'Wedding Reception',
      weekday: 'Saturday',
      venue: 'Ezzi Santacruz Hall',
      area: 'near Santacruz Railway Station',
      date: '27 March 2027',
      time: '7:00 PM',
      hijri: '20th Shawwal-ul-Mukarram',
      featured: true,
    },
    {
      name: 'Walima',
      weekday: 'Sunday',
      venue: 'Zaini Masjid',
      area: 'Kurla West, Mumbai',
      date: '28 March 2027',
      time: '1:00 PM',
      hijri: '21st Shawwal-ul-Mukarram',
    },
  ],

  closing: {
    line: 'We look forward to celebrating these blessed days with you.',
    dua: 'Inshallah.',
  },
}

export default config
