import AuthErrorBoundary from "@/components/AuthErrorBoundary/AuthErrorBoundary";
import ClaimCaseGallery from "@/components/Dashboard/Gallery/ClaimCaseGallery";

const page = async () => {
  return (
    <div className="w-full flex flex-col border rounded-lg p-4 lg:p-8 gap-4">
      <AuthErrorBoundary>
        <ClaimCaseGallery />
      </AuthErrorBoundary>
    </div>
  );
};

export default page;
