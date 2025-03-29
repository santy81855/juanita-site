import { SanityImageAssetDocument } from "next-sanity";

export interface Art {
    _id: string;
    _createdAt: string;
    _updatedAt: string;
    title: string;
    category: string;
    description: string;
    slug: { current: string };
    image: SanityImageAssetDocument;
    price: number;
}
