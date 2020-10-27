// <---- DUMMY DATA  - mongo DataBase ---->

const products = [
  {
    name: 'Mellow Habanero | Yuzu Heaven',
    image: '/images/MellowHabaneroYuzuHeaven.jpg',
    description:
      'Friends of the Brooklyn hot sauce shop will recognize Mellow Habanero and our good friend Taku “Habanero Man” Kondo of ta-nm farm in Hyogo, Japan!',
    brand: 'Yuzu Heaven',
    category: 'Food',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Hot Ones | The Last Dab XXX',
    image: '/images/HotOnesTheLastDabXXX.jpg',
    description:
      'CAUTION! The hottest sauce on Hot Ones cranks the spice level even higher with this special XXX-rated version of the Last Dab',
    brand: 'Hot Ones',
    category: 'Food',
    price: 199.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
  },
  {
    name: 'Torchbearer | Reaper Evil',
    image: '/images/TorchbearerReaperEvil.jpg',
    description:
      'One of the hottest yet from Torchbearer"s, this is just pure....Reaper! Add in a little onion and garlic for a savory touch before the pepper takes a death grip on your tastebuds. ',
    brand: 'Torchbearer',
    category: 'Food',
    price: 229.99,
    countInStock: 5,
    rating: 3,
    numReviews: 12,
  },
  {
    name: 'Seed Ranch | Hot Thai Green',
    image: '/images/SeedRanchHotThaiGreen.jpg',
    description:
      'Our friends at Seed Ranch use all-natural, organic ingredients in this bright-tasting blend. Cilantro, basil, lemongrass and ginger combine with zesty lime juice for an aromatic base that is complemented by creeping Carolina Reaper heat in.',
    brand: 'Seed Ranch',
    category: 'Food',
    price: 329.99,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  },
  {
    name: 'The Last Dab | APOLLO',
    image: '/images/TheLastDabAPOLLO.jpg',
    description:
      'The Last Dab: Apollo joins the Hot Ones lineup as the new king of Mt. Scoville, hero of hot sauces, and crusher of celebrities and chiliheads alike. The Apollo Pepper has been carefully bred and nurtured by Guinness World Record holding chili breeder Smokin’ Ed Currie of Puckerbutt Pepper Co from prized strains of his famed Carolina Reaper and Pepper X',
    brand: 'The Last Dab',
    category: 'Food',
    price: 449.99,
    countInStock: 7,
    rating: 3.5,
    numReviews: 10,
  },
  {
    name: 'Puckerbutt | Chocolate Plague',
    image: '/images/PuckerbuttChocolatePlague.jpg',
    description:
      'More than 90% of each bottle of this sauce is pure Chocolate Bhutlah, a mysterious pepper whispered by some to be the world"s hottest.',
    brand: 'Puckerbutt',
    category: 'Food',
    price: 559.99,
    countInStock: 0,
    rating: 4,
    numReviews: 5.5,
  },
  {
    name: 'Adoboloco | Hamajang Kiawe Smoked Ghost Pepper',
    image: '/images/AdobolocoHamajangKiaweSmokedGhostPepper.jpg',
    description:
      'The combination of smoked Bhut Jolokia (Ghost Pepper) and fiery Habanero give this sauce an intense level of heat and flavor.',
    brand: 'Adoboloco',
    category: 'Food',
    price: 119.99,
    countInStock: 0,
    rating: 4,
    numReviews: 8,
  },
  {
    name: 'Hell Fire Detroit | Habanero',
    image: '/images/HellFireDetroitHabanero.jpg',
    description:
      'Hellfire Detroit keeps things simple with a thick sauce that highlights the habanero pepper. Roasting them adds an element of bitterness, complimenting the fruity habanero peppers and the tang of the vinegar.',
    brand: 'Hell Fire Detroit',
    category: 'Food',
    price: 339.99,
    countInStock: 0,
    rating: 4,
    numReviews: 7,
  },
  {
    name: 'Hot Ones | The Constrictor',
    image: '/images/HotOnesTheConstrictor.jpg',
    description:
      'The most deadly of the new trio of hot sauces from Hot Ones The Game Show! The Constrictor is the first and only sauce in the world made with Reaper Blood, a proprietary distillate made by reducing Carolina Reaper peppers to their core essence.',
    brand: 'Hot Ones',
    category: 'Food',
    price: 339.99,
    countInStock: 0,
    rating: 4,
    numReviews: 14,
  },
  {
    name: 'Hot Ones | Brain Burner',
    image: '/images/HotOnesBrainBurner.jpg',
    description:
      'The opening hot sauce on Hot Ones the Game Show! This blend of Scotch Bonnet and Carolina Reaper peppers grown by Smokin’ Ed Currie delivers a dose of capsaicin straight to the cerebellum, sending rational thought out the window and begging you to take another bite.',
    brand: 'Hot Ones',
    category: 'Food',
    price: 339.99,
    countInStock: 0,
    rating: 4,
    numReviews: 3,
  },
];

// <---- EXPORT ---->
export default products;
