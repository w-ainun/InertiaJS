import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { ChevronDown, ChevronUp, User, ArrowLeft, MapPin, XCircle, PlusCircle, Trash2, Contact as ContactIcon } from 'lucide-react';
import { useForm, Head } from '@inertiajs/react';

interface UserProps {
  id: number;
  name: string;
  username: string;
  email: string;
}

type FormDataConvertible = string | number | boolean | File | null | undefined | FormDataConvertible[] | { [key: string]: FormDataConvertible };

export interface AddressProps {
  id?: number;
  post_code: string;
  country: string;
  province: string;
  city: string;
  street: string;
  more: string;
  [key: string]: FormDataConvertible;
}

interface ContactProps {
  id?: number;
  name: string;
  phone: string;
  gender: 'MAN' | 'WOMAN';
  birthday: string;
  profile?: string | File | null;
  profile_removed?: boolean;
  addresses: AddressProps[];
  [key: string]: FormDataConvertible;
}

interface ProfilePageProps {
  user: UserProps;
  contacts: ContactProps[];
  flash?: {
    success?: string;
    error?: string;
  };
  errors: Record<string, string>;
}

interface ProfileFormData {
  _method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  name: string;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  contacts: ContactProps[];
  [key: string]: FormDataConvertible;
}

export default function ProfilePage({ user, contacts: initialContacts, flash, errors: serverErrors }: ProfilePageProps) {

  const { data, setData, post, processing, errors, reset, progress } = useForm<ProfileFormData>({
    _method: 'PATCH',
    name: user.name,
    username: user.username,
    email: user.email,
    password: '',
    password_confirmation: '',
    contacts: initialContacts.length > 0 ? initialContacts.map(contact => ({
      ...contact,
      profile: null,
      profile_removed: false,
    })) : [{
      name: user.username,
      phone: '',
      gender: 'MAN',
      birthday: '',
      profile: null,
      profile_removed: false,
      addresses: [],
    }],
  });

  const [openContactIndexes, setOpenContactIndexes] = useState<number[]>([]);
  const [openAddressIndexes, setOpenAddressIndexes] = useState<Record<number, number[]>>({});
  const [profilePreviews, setProfilePreviews] = useState<Record<number, string | null>>(() => {
    const previews: Record<number, string | null> = {};
    initialContacts.forEach((contact, index) => {
      if (typeof contact.profile === 'string' && contact.profile) {
        previews[index] = `/storage/${contact.profile}`;
      }
    });
    return previews;
  });

  useEffect(() => {
    setData('contacts', initialContacts.length > 0 ? initialContacts.map(contact => ({
      ...contact,
      profile: null,
      profile_removed: false,
    })) : [{
      name: user.username,
      phone: '',
      gender: 'MAN',
      birthday: '',
      profile: null,
      profile_removed: false,
      addresses: [],
    }]);

    setOpenContactIndexes([]);
    setOpenAddressIndexes({});

    const previews: Record<number, string | null> = {};
    initialContacts.forEach((contact, index) => {
      if (typeof contact.profile === 'string' && contact.profile) {
        previews[index] = `/storage/${contact.profile}`;
      }
    });
    setProfilePreviews(previews);

  }, [initialContacts, user.username]);

  const toggleContactForm = (index: number) => {
    setOpenContactIndexes(prevIndexes =>
      prevIndexes.includes(index)
        ? prevIndexes.filter(i => i !== index)
        : [...prevIndexes, index]
    );
  };

  const toggleAddressForm = (contactIndex: number, addressIndex: number) => {
    setOpenAddressIndexes(prev => ({
      ...prev,
      [contactIndex]: prev[contactIndex]?.includes(addressIndex)
        ? prev[contactIndex].filter(i => i !== addressIndex)
        : [...(prev[contactIndex] || []), addressIndex]
    }));
  };

  const handleContactChange = (index: number, field: keyof ContactProps, value: any) => {
    setData(prevData => {
      const updatedContacts = [...prevData.contacts];
      updatedContacts[index] = {
        ...updatedContacts[index],
        [field]: value
      } as ContactProps;
      return { ...prevData, contacts: updatedContacts };
    });
  };

  const handleAddressChange = (contactIndex: number, addressIndex: number, field: keyof AddressProps, value: string) => {
    setData(prevData => {
      const updatedContacts = [...prevData.contacts];
      const updatedAddresses = [...updatedContacts[contactIndex].addresses];
      const currentAddress = updatedAddresses[addressIndex] || {};
      updatedAddresses[addressIndex] = {
        ...currentAddress,
        [field]: value
      } as AddressProps;
      updatedContacts[contactIndex] = {
        ...updatedContacts[contactIndex],
        addresses: updatedAddresses
      };
      return { ...prevData, contacts: updatedContacts };
    });
  };

  const handleAddContact = () => {
    const newContactIndex = data.contacts.length;
    setData(prevData => ({
      ...prevData,
      contacts: [
        ...prevData.contacts,
        { name: '', phone: '', gender: 'MAN', birthday: '', profile: null, profile_removed: false, addresses: [] }
      ]
    }));
    setOpenContactIndexes(prevIndexes => [...prevIndexes, newContactIndex]);
  };

  const handleRemoveContact = (index: number) => {
    if (confirm('Are you sure you want to remove this contact and all its associated addresses?')) {
      setData(prevData => {
        const updatedContacts = [...prevData.contacts];
        updatedContacts.splice(index, 1);
        return { ...prevData, contacts: updatedContacts };
      });
      setOpenContactIndexes(prevIndexes => prevIndexes.filter(i => i !== index).map(i => i > index ? i - 1 : i));
      setProfilePreviews(prevPreviews => {
        const newPreviews: Record<number, string | null> = {};
        Object.keys(prevPreviews).forEach(key => {
          const numKey = parseInt(key);
          if (numKey < index) {
            newPreviews[numKey] = prevPreviews[numKey];
          } else if (numKey > index) {
            newPreviews[numKey - 1] = prevPreviews[numKey];
          }
        });
        return newPreviews;
      });
    }
  };

  const handleAddAddress = (contactIndex: number) => {
    setData(prevData => {
      const updatedContacts = [...prevData.contacts];
      const newAddressIndex = updatedContacts[contactIndex].addresses.length;
      updatedContacts[contactIndex] = {
        ...updatedContacts[contactIndex],
        addresses: [
          ...updatedContacts[contactIndex].addresses,
          { id: undefined, post_code: '', country: '', province: '', city: '', street: '', more: '' }
        ]
      };
      setOpenAddressIndexes(prev => ({
        ...prev,
        [contactIndex]: [...(prev[contactIndex] || []), newAddressIndex]
      }));
      return { ...prevData, contacts: updatedContacts };
    });
  };

  const handleRemoveAddress = (contactIndex: number, addressIndex: number) => {
    if (confirm('Are you sure you want to remove this address?')) {
      setData(prevData => {
        const updatedContacts = [...prevData.contacts];
        const updatedAddresses = [...updatedContacts[contactIndex].addresses];
        updatedAddresses.splice(addressIndex, 1);
        updatedContacts[contactIndex] = {
          ...updatedContacts[contactIndex],
          addresses: updatedAddresses
        };
        return { ...prevData, contacts: updatedContacts };
      });
      setOpenAddressIndexes(prev => ({
        ...prev,
        [contactIndex]: (prev[contactIndex] || []).filter(i => i !== addressIndex).map(i => i > addressIndex ? i - 1 : i)
      }));
    }
  };

  const handleFileChange = (contactIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData(prevData => {
        const updatedContacts = [...prevData.contacts];
        updatedContacts[contactIndex] = {
          ...updatedContacts[contactIndex],
          profile: file,
          profile_removed: false
        };
        return { ...prevData, contacts: updatedContacts };
      });
      setProfilePreviews(prev => ({
        ...prev,
        [contactIndex]: URL.createObjectURL(file)
      }));
    }
  };

  const handleRemoveProfile = (contactIndex: number) => {
    if (confirm('Are you sure you want to remove this contact\'s profile picture?')) {
      setData(prevData => {
        const updatedContacts = [...prevData.contacts];
        updatedContacts[contactIndex] = {
          ...updatedContacts[contactIndex],
          profile: null,
          profile_removed: true,
        };
        return { ...prevData, contacts: updatedContacts };
      });
      setProfilePreviews(prev => ({
        ...prev,
        [contactIndex]: null
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('profile.update'), {
      forceFormData: true,
      onSuccess: (page) => {
        const pageProps = page.props as unknown as ProfilePageProps;
        const newFlash = pageProps.flash;
        if (newFlash?.success) {
            alert(newFlash.success);
        } else {
            alert('Profile updated successfully!');
        }
        reset('password', 'password_confirmation');
      },
      onError: (formErrors) => {
        console.error("Form submission errors:", formErrors);
        alert('Failed to update profile. Please check the form for errors.');
      },
    });
  };

  const formatAddress = (addressItem: AddressProps): string => {
    const relevantFields = [
        addressItem.street,
        addressItem.city,
        addressItem.province,
        addressItem.country,
        addressItem.post_code,
        addressItem.more
    ];
    const parts = relevantFields.filter(Boolean);
    if (parts.length === 0) {
        return 'Alamat belum diisi lengkap';
    }
    return parts.join(', ');
  };

  const displayErrors = errors || serverErrors || {};
  const typedErrors = displayErrors as Record<string, string>;

  const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900";
  const errorClassName = "text-red-500 text-sm mt-1";

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Profile" />

      <div className="bg-white shadow-sm">
        <div className="w-full px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{data.name || 'User'}</h1>
                <p className="text-sm text-gray-500">{data.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Akun Pengguna</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClassName} placeholder="Seinal Arifin"/>
                  {typedErrors.name && <p className={errorClassName}>{typedErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className={inputClassName} placeholder="Seinal"/>
                  {typedErrors.username && <p className={errorClassName}>{typedErrors.username}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClassName} placeholder="seinalarifin@gmail.com"/>
                  {typedErrors.email && <p className={errorClassName}>{typedErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password (biarkan kosong untuk tidak mengubah)</label>
                  <input type="password" value={data.password || ''} onChange={(e) => setData('password', e.target.value)} className={inputClassName} placeholder="••••••••••••••" autoComplete="new-password"/>
                  {typedErrors.password && <p className={errorClassName}>{typedErrors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                  <input type="password" value={data.password_confirmation || ''} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClassName} placeholder="••••••••••••••" autoComplete="new-password"/>
                  {typedErrors.password_confirmation && <p className={errorClassName}>{typedErrors.password_confirmation}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Kontak Saya</h3>
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="px-4 py-2 bg-[#51793E] text-white font-medium rounded-md hover:bg-opacity-90 flex items-center text-sm"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Tambah Kontak
                </button>
              </div>
              {data.contacts.length === 0 && (
                <p className="text-gray-500 text-sm">Belum ada kontak tersimpan. Klik "Tambah Kontak" untuk menambahkan.</p>
              )}
              {data.contacts.map((contactItem, contactIndex) => {
                const isContactOpen = openContactIndexes.includes(contactIndex);
                const currentProfilePreview = profilePreviews[contactIndex];

                return (
                  <div key={contactItem.id || `new-contact-${contactIndex}`} className="border border-gray-200 rounded-lg mb-4 overflow-hidden relative">
                    <button
                        type="button"
                        onClick={() => handleRemoveContact(contactIndex)}
                        className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700 p-1 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100"
                        title="Hapus kontak ini"
                        style={{ transform: 'translate(-8px, 8px)' }}
                      >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleContactForm(contactIndex)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${isContactOpen ? 'bg-green-500' : 'bg-gray-200'}`}>
                          <ContactIcon className={`w-4 h-4 ${isContactOpen ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Kontak {contactIndex + 1}: {contactItem.name || 'Nama Kontak'}</p>
                          {!isContactOpen && (
                            <p className="text-sm text-gray-600 mt-1 truncate max-w-md">
                              {contactItem.phone || 'Klik untuk mengisi detail kontak'}
                            </p>
                          )}
                        </div>
                      </div>
                      {isContactOpen ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                    </div>

                    {isContactOpen && (
                      <div className="p-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kontak</label>
                            <input type="text" value={contactItem.name} onChange={(e) => handleContactChange(contactIndex, 'name', e.target.value)} className={inputClassName} placeholder="Nama Lengkap Kontak" />
                            {typedErrors[`contacts.${contactIndex}.name`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.name`]}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">No. Handphone</label>
                            <input type="text" value={contactItem.phone} onChange={(e) => handleContactChange(contactIndex, 'phone', e.target.value)} className={inputClassName} placeholder="081234567890" />
                            {typedErrors[`contacts.${contactIndex}.phone`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.phone`]}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                            <div className="relative">
                              <select value={contactItem.gender} onChange={(e) => handleContactChange(contactIndex, 'gender', e.target.value as 'MAN' | 'WOMAN')} className={`${inputClassName} appearance-none`}>
                                <option value="MAN">Laki-laki</option>
                                <option value="WOMAN">Perempuan</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {typedErrors[`contacts.${contactIndex}.gender`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.gender`]}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                            <input type="date" value={contactItem.birthday} onChange={(e) => handleContactChange(contactIndex, 'birthday', e.target.value)} className={inputClassName} />
                            {typedErrors[`contacts.${contactIndex}.birthday`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.birthday`]}</p>}
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil Kontak</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(contactIndex, e)} className={`${inputClassName} mb-2`} />
                            {typedErrors[`contacts.${contactIndex}.profile`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.profile`]}</p>}
                            {currentProfilePreview && (
                              <div className="mt-2 flex items-center space-x-2">
                                <img src={currentProfilePreview} alt="Profile Preview" className="w-16 h-16 object-cover rounded-full" />
                                <button type="button" onClick={() => handleRemoveProfile(contactIndex)} className="text-red-500 hover:text-red-700 flex items-center text-sm">
                                  <XCircle className="w-4 h-4 mr-1" /> Hapus Foto
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-gray-800">Alamat Kontak Ini</h4>
                            <button
                              type="button"
                              onClick={() => handleAddAddress(contactIndex)}
                              className="px-3 py-1 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 flex items-center text-sm"
                            >
                              <PlusCircle className="w-3 h-3 mr-1" /> Tambah Alamat
                            </button>
                          </div>
                          {contactItem.addresses.length === 0 && (
                            <p className="text-gray-500 text-sm">Belum ada alamat tersimpan untuk kontak ini.</p>
                          )}
                          {contactItem.addresses.map((addressItem, addressIndex) => {
                            const isAddressOpen = openAddressIndexes[contactIndex]?.includes(addressIndex);
                            return (
                              <div key={addressItem.id || `new-address-${contactIndex}-${addressIndex}`} className="border border-gray-200 rounded-lg mb-3 overflow-hidden relative">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAddress(contactIndex, addressIndex)}
                                    className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700 p-1 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100"
                                    title="Hapus alamat ini"
                                    style={{ transform: 'translate(-8px, 8px)' }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                                  onClick={() => toggleAddressForm(contactIndex, addressIndex)}
                                >
                                  <div className="flex items-start space-x-2">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ${isAddressOpen ? 'bg-indigo-500' : 'bg-gray-200'}`}>
                                      <MapPin className={`w-3 h-3 ${isAddressOpen ? 'text-white' : 'text-gray-500'}`} />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">Alamat {addressIndex + 1}</p>
                                      {!isAddressOpen && (
                                        <p className="text-sm text-gray-600 mt-1 truncate max-w-xs">
                                          {formatAddress(addressItem) || 'Klik untuk mengisi alamat'}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {isAddressOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                                </div>

                                {isAddressOpen && (
                                  <div className="p-3 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
                                        <input type="text" value={addressItem.post_code} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'post_code', e.target.value)} className={inputClassName} placeholder="12345" />
                                        {typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.post_code`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.post_code`]}</p>}
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Negara</label>
                                        <input type="text" value={addressItem.country} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'country', e.target.value)} className={inputClassName} placeholder="Indonesia" />
                                        {typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.country`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.country`]}</p>}
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                                        <input type="text" value={addressItem.province} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'province', e.target.value)} className={inputClassName} placeholder="Jawa Timur" />
                                        {typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.province`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.province`]}</p>}
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
                                        <input type="text" value={addressItem.city} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'city', e.target.value)} className={inputClassName} placeholder="Bangkalan" />
                                        {typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.city`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.city`]}</p>}
                                      </div>
                                      <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jalan</label>
                                        <input type="text" value={addressItem.street} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'street', e.target.value)} className={inputClassName} placeholder="Jl telang indah 2 timur" />
                                        {typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.street`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.street`]}</p>}
                                      </div>
                                      <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Detail Tambahan</label>
                                        <input type="text" value={addressItem.more} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'more', e.target.value)} className={inputClassName} placeholder="Rumah nomor 69162" />
                                        {typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.more`] && <p className={errorClassName}>{typedErrors[`contacts.${contactIndex}.addresses.${addressIndex}.more`]}</p>}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-[#51793E] text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#51793E] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
