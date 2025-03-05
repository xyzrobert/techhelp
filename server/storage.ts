import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  bookings, type Booking, type InsertBooking,
  reviews, type Review, type InsertReview
} from "@shared/schema";

// Payment interface
export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  studentAmount: number;
  platformAmount: number;
  method: string;
  status: string;
  date: Date;
}

export interface InsertPayment {
  bookingId: number;
  amount: number;
  studentAmount: number;
  platformAmount: number;
  method: string;
  date: Date;
}

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnlineStatus(id: number, isOnline: boolean): Promise<User>;
  getOnlineHelpers(): Promise<User[]>;
  setUserVerified(userId: number, verified: boolean): Promise<User>;

  // Services
  createService(service: InsertService): Promise<Service>;
  getService(id: number): Promise<Service | undefined>;
  getHelperServices(helperId: number): Promise<Service[]>;
  searchServices(category?: string): Promise<Service[]>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getServiceReviews(serviceId: number): Promise<Review[]>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: number): Promise<Payment | undefined>;
  getBookingPayment(bookingId: number): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  updatePaymentStatus(id: number, status: string): Promise<Payment>;

  // Verifications
  createVerification(data: Omit<Verification, 'id'>): Promise<Verification>;
  getUserVerification(userId: number): Promise<Verification | null>;
  getAllVerifications(): Promise<Verification[]>;
  getVerification(id: number): Promise<Verification | null>;
  reviewVerification(id: number, status: 'approved' | 'rejected', reviewedBy: number, feedback?: string): Promise<Verification>;
}

// Types for the in-memory data store
interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: "client" | "helper" | "admin";
  bio?: string;
  phoneNumber?: string;
  showPhone: boolean;
  isOnline?: boolean;
  verified?: boolean;
}

interface Verification {
  id: number;
  userId: number;
  routerSetup: string;
  wpsExplanation: string;
  firewallSetting: string;
  windowsIssue: string;
  cableTypes: string;
  technicalExperience: string;
  toolsUsed: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedBy?: number;
  reviewedAt?: Date;
  feedback?: string;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private payments: Map<number, Payment>;
  private verifications: Map<number, Verification>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.payments = new Map();
    this.verifications = new Map();
    this.currentIds = {
      users: 1,
      services: 1,
      bookings: 1,
      reviews: 1,
      payments: 1,
      verifications: 1
    };
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { 
      ...insertUser, 
      id,
      isOnline: false,
      rating: 0,
      verified: false
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserOnlineStatus(id: number, isOnline: boolean): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updated = { ...user, isOnline };
    this.users.set(id, updated);
    return updated;
  }

  async getOnlineHelpers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      user => user.role === "helper" && user.isOnline
    );
  }

  async setUserVerified(userId: number, verified: boolean): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    const updated = {...user, verified};
    this.users.set(userId, updated);
    return updated;
  }


  // Services
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentIds.services++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getHelperServices(helperId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      service => service.helperId === helperId
    );
  }

  async searchServices(category?: string): Promise<Service[]> {
    let services = Array.from(this.services.values());
    if (category) {
      services = services.filter(service => service.category === category);
    }
    return services;
  }

  // Bookings
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentIds.bookings++;
    const booking: Booking = { 
      ...insertBooking, 
      id,
      status: "pending"
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.clientId === userId
    );
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const booking = await this.getBooking(id);
    if (!booking) throw new Error("Booking not found");

    const updated = { ...booking, status };
    this.bookings.set(id, updated);
    return updated;
  }

  // Reviews
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentIds.reviews++;
    const review: Review = { ...insertReview, id };
    this.reviews.set(id, review);
    return review;
  }

  async getServiceReviews(serviceId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.bookingId === serviceId
    );
  }

  // Payments
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentIds.payments++;
    const payment: Payment = { 
      ...insertPayment, 
      id,
      status: "pending"
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getBookingPayment(bookingId: number): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(
      payment => payment.bookingId === bookingId
    );
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    const payment = await this.getPayment(id);
    if (!payment) throw new Error("Payment not found");

    const updated = { ...payment, status };
    this.payments.set(id, updated);
    return updated;
  }

  // Verifications
  async createVerification(data: Omit<Verification, 'id'>): Promise<Verification> {
    const id = this.currentIds.verifications++;
    const verification: Verification = { id, ...data, createdAt: new Date() };
    this.verifications.set(id, verification);
    return verification;
  }

  async getUserVerification(userId: number): Promise<Verification | null> {
    const verifications = Array.from(this.verifications.values()).filter(v => v.userId === userId);
    return verifications.length > 0 ? verifications[0] : null;
  }

  async getAllVerifications(): Promise<Verification[]> {
    return Array.from(this.verifications.values());
  }

  async getVerification(id: number): Promise<Verification | null> {
    return this.verifications.get(id) || null;
  }

  async reviewVerification(id: number, status: 'approved' | 'rejected', reviewedBy: number, feedback?: string): Promise<Verification> {
    const verification = await this.getVerification(id);
    if (!verification) throw new Error("Verification not found");
    const updated = { ...verification, status, reviewedBy, reviewedAt: new Date(), feedback };
    this.verifications.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();