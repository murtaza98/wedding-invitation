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

  // The formal invitation panel (Bismillah → blessings → elders → the names).
  invitation: {
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',

    blessing: [
      'By the grace of Almighty Allah,',
      'the blessings of our revered Syedna Mohammed Burhanuddin (r.a),',
      'and the dua mubarak of our beloved Syedna Aali Qadr Mufaddal Saifuddin (t.u.s),',
      'and with the heartfelt blessings of our respected elders —',
    ],

    // One entry per line in the elders block.
    elders: [
      'Late Ibrahim Patrawala',
      'Taher and Zainab Lalipurwala & Bilkis Madraswala',
    ],

    // Paternal grandmother — set include:true to add her to the elders block.
    // (Left off by default since she is not marked "Late".)
    paternalGrandmother: {
      include: false,
      line: 'Sakina Patrawala',
    },

    groom: 'Murtaza',
    groomLineage: 'S/O Taher and Maleka Patrawala',
    connector: 'weds',
    bride: 'Sakina',

    regardsLabel: 'With best regards from',
    regardsNames: 'Durriya & Murtaza Lalipurwala and Family',
  },

  // The scratch-to-reveal panel (reveals all four celebration dates).
  scratch: {
    eyebrow: 'Scratch to reveal',
    title: 'The Dates',
    foilLabel: 'Scratch here',
    revealButton: 'Reveal the dates',
    dates: [
      {
        event: 'Mehandi',
        weekday: 'Thursday',
        date: '25 March 2027',
        hijri: '18th Shawwal-ul-Mukarram',
      },
      {
        event: 'Nikah',
        weekday: 'Friday',
        date: '26 March 2027',
        hijri: '19th Shawwal-ul-Mukarram',
      },
      {
        event: 'Wedding Reception',
        weekday: 'Saturday',
        date: '27 March 2027',
        hijri: '20th Shawwal-ul-Mukarram',
        featured: true,
      },
      {
        event: 'Walima',
        weekday: 'Sunday',
        date: '28 March 2027',
        hijri: '21st Shawwal-ul-Mukarram',
      },
    ],
  },

  // The four celebrations.
  eventsTitle: 'The Celebrations',
  events: [
    {
      name: 'Mehandi',
      venue: 'Bandra',
      area: 'Mumbai',
      date: '25 March 2027',
      time: '7:00 PM',
      hijri: '18th Shawwal-ul-Mukarram',
    },
    {
      name: 'Nikah',
      venue: 'Zaini Masjid',
      area: 'Kurla West, Mumbai',
      date: '26 March 2027',
      time: '7:00 PM',
      hijri: '19th Shawwal-ul-Mukarram',
    },
    {
      name: 'Vehwaan Reception',
      venue: 'Santacruz Masjid',
      area: 'Mumbai',
      date: '27 March 2027',
      time: '7:00 PM',
      hijri: '20th Shawwal-ul-Mukarram',
    },
    {
      name: 'Walima',
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
