// import { type PhotoData, type AlbumData } from '../types/feeds';

// export const MOCK_PHOTOS: PhotoData[] = [
//   {
//     id: 1,
//     title: "Cute Kiki",
//     description: "This is a picture of some cute dogs that I found on the internet. They are so adorable!",
//     image_url: "/dog.jpg",
//     likes_count: 100,
//     created_at: "4:56pm 20/06/2026",
//     author: { 
//       id: 10, 
//       first_name: "Kho", 
//       last_name: "Voi", 
//       avatar_url: "/avt.png",
//       is_following: true 
//     }
//   },
//   {
//     id: 2,
//     title: "Beautiful Green Leaf",
//     description: "A close-up shot focusing on the intricate patterns of a fresh green leaf during summer.",
//     image_url: "/avt.png",
//     likes_count: 45,
//     created_at: "2:15pm 19/06/2026",
//     author: { 
//       id: 11, 
//       first_name: "Hieu", 
//       last_name: "Nguyen", 
//       is_following: false 
//     }
//   },
//   {
//     id: 3,
//     title: "Loyal Golden Retriever",
//     description: "My golden retriever waiting patiently by the door for me to come back home.",
//     image_url: "/dog2.jpg",
//     likes_count: 230,
//     created_at: "10:05am 18/06/2026",
//     author: { 
//       id: 12, 
//       first_name: "Hansford", 
//       last_name: "Nguyen", 
//       is_following: true 
//     }
//   },
//   {
//     id: 4,
//     title: "Wedding Memory",
//     description: "Capturing the beautiful bride walking under the sunshine. Truly a magical moment.",
//     image_url: "/dog.jpg",
//     likes_count: 512,
//     created_at: "8:20pm 15/06/2026",
//     author: { 
//       id: 13, 
//       first_name: "Lai", 
//       last_name: "Quan", 
//       is_following: false 
//     }
//   }
// ];

// export const MOCK_ALBUMS: AlbumData[] = [
//   {
//     id: 201,
//     title: "Nam tempor posuere faucibus",
//     description: "Aliquam dictum nec massa ac consequat. Etiam dignissim tincidunt tellus sed vestibulum. Sed vitae vestibulum purus.",
//     likes_count: 123,
//     created_at: "4:56pm 01/04/2018",
//     images: ["/dog.jpg", "/dog3.jpg", "/dog2.jpg"],
//     author: { 
//       id: 11, 
//       first_name: "Hieu", 
//       last_name: "Nguyen", 
//       is_following: false 
//     }
//   },
//   {
//     id: 202,
//     title: "Summer Vacation 2026",
//     description: "Collection of wonderful moments with my family at Phu Quoc island. Beautiful beaches and great seafood!",
//     likes_count: 89,
//     created_at: "1:30pm 15/06/2026",
//     images: ["/dog2.jpg", "/dog.jpg"],
//     author: { 
//       id: 14, 
//       first_name: "Hai", 
//       last_name: "Nam", 
//       is_following: true 
//     }
//   },
//   {
//     id: 203,
//     title: "My Pet Journey",
//     description: "Tracking the growth of my puppy from day one until now. They grow up so fast!",
//     likes_count: 340,
//     created_at: "9:15am 12/06/2026",
//     images: ["/dog3.jpg", "/dog2.jpg", "/dog.jpg"],
//     author: { 
//       id: 10, 
//       first_name: "Kho", 
//       last_name: "Voi", 
//       is_following: true 
//     }
//   },
//   {
//     id: 204,
//     title: "Street Photography",
//     description: "Random daily life moments captured on the streets of Ho Chi Minh City.",
//     likes_count: 76,
//     created_at: "11:45pm 10/06/2026",
//     images: ["/avt.png"],
//     author: { 
//       id: 15, 
//       first_name: "Quang", 
//       last_name: "Phong", 
//       is_following: false 
//     }
//   }
// ];


export const MOCK_PHOTOS: PhotoData[] = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const authorId = 10 + (id % 4);
  const names = ["Kho Voi", "Hieu Nguyen", "Hansford Nguyen", "Lai Quan"];
  
  return {
    id,
    title: `Photo Title ${id}`,
    description: `This is the description for photo number ${id}. It simulated data fetched from Backend API endpoint for pagination test.`,
    image_url: "/dog.jpg",
    likes_count: 50 + (id * 7) % 200,
    created_at: `4:${10 + id}pm 20/06/2026`,
    author: {
      id: authorId,
      first_name: names[id % 4].split(' ')[0],
      last_name: names[id % 4].split(' ').slice(1).join(' ') || 'User',
      is_following: id % 3 === 0
    }
  };
});

export const MOCK_ALBUMS: AlbumData[] = Array.from({ length: 16 }, (_, index) => {
  const id = 201 + index;
  const authorId = 20 + (id % 4);
  const names = ["Hieu Nguyen", "Hai Nam", "Kho Voi", "Quang Phong"];
  
  return {
    id,
    title: `Album Collection ${id}`,
    description: `This is an amazing photo collection of album ${id}. Curabitur malesuada libero in nibh pretium, sed malesuada nisi feugiat.`,
    likes_count: 30 + (id * 11) % 150,
    created_at: `1:${index + 5}pm 15/06/2026`,
    images: ["/dog.jpg", "/dog2.jpg", "/dog3.jpg", "avt.png"],
    author: {
      id: authorId,
      first_name: names[index % 4].split(' ')[0],
      last_name: names[index % 4].split(' ').slice(1).join(' ') || 'Admin',
      is_following: index % 2 === 0
    }
  };
});