import { z } from "zod";

const idParam = z.object({
  params: z.object({
    id: z.coerce.number().int().positive()
  })
});

const optionalText = z.string().trim().optional();
const requiredText = (min = 2, max = 220) => z.string().trim().min(min).max(max);

export const schemas = {
  idParam,
  register: z.object({
    body: z.object({
      firstName: requiredText(2, 80),
      lastName: requiredText(2, 80),
      email: z.string().email(),
      password: z.string().min(8),
      city: requiredText(2, 80),
      school: requiredText(2, 160),
      fieldOfStudy: requiredText(2, 120),
      bio: optionalText
    })
  }),
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(1)
    })
  }),
  profile: z.object({
    body: z.object({
      firstName: optionalText,
      lastName: optionalText,
      city: optionalText,
      school: optionalText,
      fieldOfStudy: optionalText,
      bio: optionalText
    })
  }),
  housing: z.object({
    body: z.object({
      title: requiredText(4, 180),
      description: requiredText(15, 3000),
      type: z.enum(["chambre", "studio", "appartement", "colocation"]).default("colocation"),
      city: requiredText(2, 80),
      school: requiredText(2, 160),
      fieldOfStudy: optionalText,
      address: requiredText(4, 220),
      latitude: z.coerce.number().optional(),
      longitude: z.coerce.number().optional(),
      price: z.coerce.number().min(0),
      rooms: z.coerce.number().int().min(1).default(1),
      availableFrom: z.string().min(8),
      amenities: z.any().optional()
    })
  }),
  marketplace: z.object({
    body: z.object({
      title: requiredText(4, 180),
      description: requiredText(10, 3000),
      category: z.enum(["document", "livre", "materiel", "electronique", "autre"]),
      transactionType: z.enum(["vente", "achat"]).default("vente"),
      price: z.coerce.number().min(0).default(0),
      condition: z.enum(["neuf", "tres_bon", "bon", "acceptable", "numerique"]).default("bon"),
      city: requiredText(2, 80),
      school: requiredText(2, 160),
      fieldOfStudy: optionalText
    })
  }),
  ride: z.object({
    body: z.object({
      departureCity: requiredText(2, 80),
      departureAddress: requiredText(3, 220),
      destinationCity: requiredText(2, 80),
      destinationAddress: requiredText(3, 220),
      departureAt: z.string().min(8),
      seatsTotal: z.coerce.number().int().min(1).max(8),
      seatsAvailable: z.coerce.number().int().min(1).max(8).optional(),
      pricePerSeat: z.coerce.number().min(0).default(0),
      carModel: optionalText,
      notes: optionalText,
      city: requiredText(2, 80),
      school: requiredText(2, 160)
    })
  }),
  event: z.object({
    body: z.object({
      title: requiredText(4, 180),
      description: requiredText(10, 3000),
      eventType: z.enum(["conference", "atelier", "soiree", "sport", "voyage", "culture"]).default("conference"),
      city: requiredText(2, 80),
      school: requiredText(2, 160),
      fieldOfStudy: optionalText,
      venue: requiredText(3, 220),
      startsAt: z.string().min(8),
      endsAt: z.string().min(8).optional(),
      price: z.coerce.number().min(0).default(0),
      capacity: z.coerce.number().int().min(1).default(40)
    })
  }),
  job: z.object({
    body: z.object({
      title: requiredText(4, 180),
      company: requiredText(2, 160),
      description: requiredText(15, 3000),
      opportunityType: z.enum(["stage", "job_etudiant", "service_freelance"]),
      workMode: z.enum(["presentiel", "hybride", "remote"]).default("hybride"),
      city: requiredText(2, 80),
      school: optionalText,
      fieldOfStudy: optionalText,
      salary: optionalText,
      deadline: optionalText,
      skills: z.any().optional(),
      contactEmail: z.string().email()
    })
  }),
  message: z.object({
    body: z.object({
      participantId: z.coerce.number().int().positive().optional(),
      conversationId: z.coerce.number().int().positive().optional(),
      body: requiredText(1, 4000)
    })
  }),
  review: z.object({
    body: z.object({
      targetUserId: z.coerce.number().int().positive(),
      rating: z.coerce.number().int().min(1).max(5),
      comment: requiredText(4, 2000)
    })
  }),
  report: z.object({
    body: z.object({
      reason: requiredText(5, 240)
    })
  }),
  reservation: z.object({
    params: z.object({
      id: z.coerce.number().int().positive()
    }),
    body: z.object({
      seats: z.coerce.number().int().min(1).max(8).default(1)
    })
  })
};
