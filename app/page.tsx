import Map from "./Utilities/Map";
import Header from "./Home Page/Main";
import Footer from "./Home Page/Footer";
import { auth } from "@/app/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export default async function Home() {
  const session = await auth();
  let mongoUser = null;

  if (session?.user?.email) {
    await connectDB();
    mongoUser = await User.findOne({ email: session.user.email }).lean();
    // Serialize the MongoDB object to simple JSON to avoid passing complex objects to client components if needed, 
    // though .lean() helps. We maintain the structure we need.
    if (mongoUser) {
      mongoUser = {
        ...mongoUser,
        _id: mongoUser._id.toString(),
        createdAt: mongoUser.createdAt?.toISOString(),
        updatedAt: mongoUser.updatedAt?.toISOString(),
      }
    }
  }

  return (
    <div>

      <Header user={mongoUser} />


    </div>
  );
}
