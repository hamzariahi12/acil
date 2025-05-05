import bcrypt from "bcryptjs";
const data = {
  users:[
    {
    name:'hamzaa',
    email:'hamzaa@gmail.com',
    password: bcrypt.hashSync('1234',8),
    isAdmin:true,
    },
    {
      name:'malek',
      email:'malek@gmail.com',
      password: bcrypt.hashSync('123456',8),
      isAdmin:false,
      },
      {
        name:'mohamed',
        email:'mohamed@gmail.com',
        password: bcrypt.hashSync('12345678',8),
        isAdmin:false,
        }

  ],
    restaurants :[
      {
    
      name: 'The Gourmet Kitchen',
      image:'/images/restaurant4.jpg',
    location: 'bizert',
    rating:'3'
      } ,
      {
    
      name: 'The Culinary Spot',
      image:'/images/restaurant1.jpg',
      location: 'Ariana',
      rating:'4'
        } ,
        {
      name: 'Taste of Italy',
      image:'/images/restaurant2.jpg',
      location: 'Tunis',
      rating: '5'
    }
    ,
      {
        name: 'Spice Route',
        image:'/images/restaurant3.jpg',
        location: 'Sousse',
        rating: '4'
      }
  
    ]
  };
  export default data;