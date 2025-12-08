import { EntryResponse, UserProfileResponse, NotificationResponse } from "@/types/api";

export const mockUsers: UserProfileResponse[] = [
  {
    id: "sarah-chen",
    username: "sarah-chen",
    bio: "Writer, thinker, coffee enthusiast. Exploring the intersection of technology and humanity.",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "marcus-wright",
    username: "marcus-wright",
    bio: "Photographer and storyteller. Finding beauty in the everyday moments.",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "elena-rodriguez",
    username: "elena-rodriguez",
    bio: "Food writer and recipe developer. Sharing my culinary adventures from around the world.",
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinedAt: "2024-03-10T09:15:00Z",
  },
];

export const mockEntries: EntryResponse[] = [
  {
    id: "1",
    title: "The Art of Slow Living in a Fast-Paced World",
    content: `In our constantly connected world, the art of slow living has become both a rebellion and a necessity. We scroll through endless feeds, respond to countless notifications, and measure our worth in productivity metrics. But what if we chose differently?

Slow living isn't about doing everything at a snail's pace. It's about intentionality. It's about choosing where to direct our energy and being fully present in those moments. When I make my morning coffee, I don't check my phone. I listen to the water boil, smell the grounds, and feel the warmth of the cup in my hands.

This practice has transformed not just my mornings, but my entire approach to life. I've learned that presence is the ultimate luxury in our age of distraction.

The benefits extend beyond mental peace. My creativity has flourished. Ideas need space to breathe, and slow living provides that oxygen. Projects that once felt like burdens now feel like adventures.

Start small. One intentional moment a day. Build from there. You'll be amazed at how quickly presence becomes your default mode.`,
    tags: ["lifestyle", "mindfulness", "wellness"],
    visibility: "PUBLIC",
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
    imageUrls: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop"],
    authorId: "sarah-chen",
    authorUsername: "sarah-chen",
    authorProfilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    title: "Light and Shadow: A Photographer's Journey Through Tokyo",
    content: `Tokyo is a city of contrasts. Ancient temples stand in the shadow of gleaming skyscrapers. Serene gardens exist mere blocks from neon-lit entertainment districts. As a photographer, I've spent the last month trying to capture this duality.

My journey began in Yanaka, one of Tokyo's oldest neighborhoods. Here, the morning light filters through narrow alleyways, casting long shadows on cobblestone streets. I found myself returning day after day, each visit revealing new details I'd missed before.

The real magic happens during the "golden hour" — that brief window when the sun sits low on the horizon. In Tokyo, this light transforms ordinary scenes into something extraordinary. A businessman waiting for his train becomes a silhouette against a blazing orange sky.

I've learned that the best photographs aren't about the grand landmarks. They're about the spaces in between — the quiet moments that most people overlook.

Photography has taught me to see differently. Every city has its own rhythm, its own light. Tokyo's rhythm is fast, but its light? The light here is patient, waiting for those who stop long enough to notice.`,
    tags: ["photography", "travel", "tokyo"],
    visibility: "PUBLIC",
    createdAt: "2024-11-28T14:30:00Z",
    updatedAt: "2024-11-28T14:30:00Z",
    imageUrls: ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop"],
    authorId: "marcus-wright",
    authorUsername: "marcus-wright",
    authorProfilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    title: "The Perfect Risotto: A Love Letter to Italian Cooking",
    content: `There's a moment in making risotto when everything comes together — the rice has absorbed the perfect amount of broth, the Parmesan has melted into creamy waves, and the butter has added that final, luxurious sheen. That moment is why I cook.

My grandmother taught me that risotto isn't about following a recipe. It's about understanding the rice, feeling when it needs more liquid, knowing by instinct when to add the next ladle of broth. "Cook with your senses," she would say, "not with a timer."

The foundation is everything. Use real Arborio or Carnaroli rice. Toast it properly in the pan until each grain is coated in butter and slightly translucent at the edges. This step is non-negotiable.

The broth should be warm, almost simmering. Cold broth shocks the rice and interrupts the cooking process. Add it gradually, stirring with patience and purpose. This isn't a dish for those in a hurry.

The final addition — a process Italians call "mantecatura" — is where risotto transforms from good to transcendent. Off the heat, stir in cold butter and freshly grated Parmigiano-Reggiano. The result should flow like lava when you plate it.

Risotto teaches us that the best things in life require attention, patience, and love.`,
    tags: ["food", "cooking", "italian"],
    visibility: "PUBLIC",
    createdAt: "2024-11-25T19:00:00Z",
    updatedAt: "2024-11-25T19:00:00Z",
    imageUrls: ["https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=500&fit=crop"],
    authorId: "elena-rodriguez",
    authorUsername: "elena-rodriguez",
    authorProfilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    title: "Why I Deleted Social Media (And What Happened Next)",
    content: `Three months ago, I deleted all my social media accounts. Not a temporary detox — a permanent goodbye. Friends thought I was crazy. Colleagues wondered how I'd stay "relevant." Here's what actually happened.

The first week was genuinely difficult. I reached for my phone constantly, fingers automatically searching for apps that no longer existed. The phantom scrolling was real. But by week two, something shifted.

I started reading books again. Not articles, not threads — actual books. Cover to cover. I finished eight novels in the first month. My attention span, which I thought was permanently fractured, began to heal.

Conversations became deeper. Without the crutch of sharing content or checking notifications, I had to be fully present with the people in front of me. It was uncomfortable at first, then liberating.

The fear of missing out transformed into the joy of missing out. I stopped caring about trending topics and started caring about the trends in my own life.

I'm not saying everyone should quit social media. But I am saying that the life on the other side is richer than I expected. The world keeps turning. News still reaches me. And somehow, I feel more connected than ever — to myself, to others, to the present moment.`,
    tags: ["technology", "lifestyle", "digital-wellness"],
    visibility: "PUBLIC",
    createdAt: "2024-11-20T11:00:00Z",
    updatedAt: "2024-11-20T11:00:00Z",
    imageUrls: ["https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=500&fit=crop"],
    authorId: "sarah-chen",
    authorUsername: "sarah-chen",
    authorProfilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "5",
    title: "Desert Solitude: Finding Clarity in Joshua Tree",
    content: `The desert teaches you that emptiness can be full. I drove to Joshua Tree National Park seeking escape from city noise, but found something more profound — a confrontation with silence.

The first night, the quiet was almost overwhelming. No traffic, no sirens, no background hum of civilization. Just wind through the Joshua trees and the occasional call of a night bird. I lay on a blanket, watching more stars than I'd seen in years, and felt the weight of my thoughts without distraction.

Photography in the desert requires patience. The landscape seems monochromatic at first — all browns and tans and dusty greens. But spend time here, and you'll see the subtle variations, the way light paints different stories on the same rocks hour by hour.

I woke before dawn each morning to catch the blue hour, that magical time when the sky turns deep indigo and the first hints of orange appear on the horizon. In those moments, alone in the vastness, I understood why people seek the desert for spiritual renewal.

The desert strips away the unnecessary. Out here, you need water, shelter, and presence. Everything else is luxury. That simplicity clarifies the mind in ways urban life never can.

I left Joshua Tree with memory cards full of images and a mind finally quiet.`,
    tags: ["photography", "nature", "travel"],
    visibility: "PUBLIC",
    createdAt: "2024-11-15T06:00:00Z",
    updatedAt: "2024-11-15T06:00:00Z",
    imageUrls: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop"],
    authorId: "marcus-wright",
    authorUsername: "marcus-wright",
    authorProfilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
];

export const mockNotifications: NotificationResponse[] = [
  {
    id: "n1",
    recipientUsername: "current-user",
    actorUsername: "sarah-chen",
    type: "FOLLOW_REQUEST",
    message: "sarah-chen wants to follow you",
    read: false,
    createdAt: "2024-12-07T10:30:00Z",
  },
  {
    id: "n2",
    recipientUsername: "current-user",
    actorUsername: "marcus-wright",
    type: "FOLLOW_APPROVED",
    message: "marcus-wright accepted your follow request",
    read: true,
    createdAt: "2024-12-06T15:45:00Z",
  },
];
