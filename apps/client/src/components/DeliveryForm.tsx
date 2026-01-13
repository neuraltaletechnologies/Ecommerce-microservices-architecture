import { DeliveryFormInputs, deliveryFormSchema } from "@repo/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, Save, MapPin, Trash2, Star, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import useDeliveryStore, { SavedDeliveryAddress } from "@/stores/deliveryStore";
import { useState, useEffect } from "react";

const DeliveryForm = ({
  setDeliveryForm,
  initialData,
}: {
  setDeliveryForm: (data: DeliveryFormInputs) => void;
  initialData?: DeliveryFormInputs;
}) => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [showSaveOption, setShowSaveOption] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const {
    getSavedAddresses,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    getDefaultAddress,
    hasHydrated,
  } = useDeliveryStore();

  const userId = user?.id || "";
  const userAddresses = hasHydrated ? getSavedAddresses(userId) : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryFormInputs>({
    resolver: zodResolver(deliveryFormSchema as any),
    defaultValues: initialData,
  });

  // Load default address when user signs in
  useEffect(() => {
    if (hasHydrated && isSignedIn && userId && !initialData) {
      const defaultAddr = getDefaultAddress(userId);
      if (defaultAddr) {
        reset({
          name: defaultAddr.name,
          email: defaultAddr.email,
          phone: defaultAddr.phone,
          address: defaultAddr.address,
          city: defaultAddr.city,
        });
        setSelectedPreset(defaultAddr.id);
      }
    }
  }, [hasHydrated, isSignedIn, userId, getDefaultAddress, reset, initialData]);

  const handleDeliveryForm: SubmitHandler<DeliveryFormInputs> = (data) => {
    // Save address if user opted to
    if (showSaveOption && addressLabel && isSignedIn && userId) {
      addSavedAddress(userId, {
        ...data,
        label: addressLabel,
        isDefault: setAsDefault,
      });
    }
    
    setDeliveryForm(data);
    router.push("/cart?step=3", { scroll: false });
  };

  const handleSelectPreset = (preset: SavedDeliveryAddress) => {
    reset({
      name: preset.name,
      email: preset.email,
      phone: preset.phone,
      address: preset.address,
      city: preset.city,
    });
    setSelectedPreset(preset.id);
    setShowSavedAddresses(false);
  };

  const handleDeletePreset = (e: React.MouseEvent, addressId: string) => {
    e.stopPropagation();
    if (userId) {
      deleteSavedAddress(userId, addressId);
      if (selectedPreset === addressId) {
        setSelectedPreset(null);
      }
    }
  };

  const handleSetDefault = (e: React.MouseEvent, addressId: string) => {
    e.stopPropagation();
    if (userId) {
      setDefaultAddress(userId, addressId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Saved Addresses Section */}
      {isSignedIn && hasHydrated && userAddresses.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowSavedAddresses(!showSavedAddresses)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#001E3C]/5 to-[#0A7EA4]/5 border border-[#0A7EA4]/20 rounded-xl hover:border-[#0A7EA4]/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#0A7EA4]" />
              <span className="font-medium text-gray-900">Use Saved Address</span>
              <span className="text-xs bg-[#0A7EA4] text-white px-2 py-0.5 rounded-full">
                {userAddresses.length}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showSavedAddresses ? "rotate-180" : ""}`} />
          </button>

          {showSavedAddresses && (
            <div className="space-y-2 pl-2">
              {userAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => handleSelectPreset(addr)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                    selectedPreset === addr.id
                      ? "border-[#0A7EA4] bg-[#0A7EA4]/5"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-xs bg-[#FDB913] text-[#001E3C] px-2 py-0.5 rounded-full font-medium">
                            Default
                          </span>
                        )}
                        {selectedPreset === addr.id && (
                          <Check className="w-4 h-4 text-[#0A7EA4]" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{addr.name}</p>
                      <p className="text-sm text-gray-500">{addr.address}, {addr.city}</p>
                      <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={(e) => handleSetDefault(e, addr.id)}
                          className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                          title="Set as default"
                        >
                          <Star className="w-4 h-4 text-yellow-500" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDeletePreset(e, addr.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      {isSignedIn && hasHydrated && userAddresses.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or enter new address</span>
          </div>
        </div>
      )}

      {/* Delivery Form */}
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleDeliveryForm)}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-xs text-gray-500 font-medium">
            Full Name
          </label>
          <input
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none text-sm focus:border-[#0A7EA4] focus:ring-2 focus:ring-[#0A7EA4]/20 transition-all"
            type="text"
            id="name"
            placeholder="John Doe"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs text-gray-500 font-medium">
            Email Address
          </label>
          <input
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none text-sm focus:border-[#0A7EA4] focus:ring-2 focus:ring-[#0A7EA4]/20 transition-all"
            type="email"
            id="email"
            placeholder="johndoe@gmail.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-xs text-gray-500 font-medium">
            Phone Number
          </label>
          <input
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none text-sm focus:border-[#0A7EA4] focus:ring-2 focus:ring-[#0A7EA4]/20 transition-all"
            type="text"
            id="phone"
            placeholder="123456789"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-xs text-gray-500 font-medium">
            Street Address
          </label>
          <input
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none text-sm focus:border-[#0A7EA4] focus:ring-2 focus:ring-[#0A7EA4]/20 transition-all"
            type="text"
            id="address"
            placeholder="123 Main St, Anytown"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className="text-xs text-gray-500 font-medium">
            City
          </label>
          <input
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none text-sm focus:border-[#0A7EA4] focus:ring-2 focus:ring-[#0A7EA4]/20 transition-all"
            type="text"
            id="city"
            placeholder="Dar es Salaam"
            {...register("city")}
          />
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* Save Address Option (for logged-in users only) */}
        {isSignedIn && (
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showSaveOption}
                onChange={(e) => setShowSaveOption(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#0A7EA4] focus:ring-[#0A7EA4]"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save this address for future orders
              </span>
            </label>

            {showSaveOption && (
              <div className="pl-8 space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-1">
                  <label htmlFor="addressLabel" className="text-xs text-gray-500 font-medium">
                    Address Label (e.g., Home, Office, etc.)
                  </label>
                  <input
                    className="border border-gray-200 rounded-lg px-4 py-2 outline-none text-sm focus:border-[#0A7EA4] focus:ring-2 focus:ring-[#0A7EA4]/20 transition-all"
                    type="text"
                    id="addressLabel"
                    placeholder="Home"
                    value={addressLabel}
                    onChange={(e) => setAddressLabel(e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#FDB913] focus:ring-[#FDB913]"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Set as default address
                  </span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/cart?step=1", { scroll: false })}
            className="flex-1 bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-gray-700 p-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#FDB913] hover:bg-[#e5a811] transition-all duration-300 text-[#001E3C] p-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#FDB913]/20"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;
