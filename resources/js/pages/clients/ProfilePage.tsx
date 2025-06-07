import React, { useState, FormEvent, ChangeEvent, FC } from 'react';
import { ChevronDown, ChevronUp, User, ArrowLeft, MapPin, XCircle, PlusCircle, Trash2, Contact as ContactIcon } from 'lucide-react';
import { useForm, Head, Page } from '@inertiajs/react';

interface UserData {
  id: number;
  username: string;
  email: string;
}

interface UserProps {
  data: UserData;
}

export interface AddressProps {
  id?: number;
  post_code: string;
  country: string;
  province: string;
  city: string;
  street: string;
  more: string;
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
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  contacts: ContactProps[];
  [key: string]: any;
}

const ProfilePage: FC<ProfilePageProps> = ({ user, contacts: initialContacts, errors: serverErrors }) => {

  const initialFormData: ProfileFormData = {
    username: user.data.username ?? '',
    email: user.data.email ?? '',
    password: '',
    password_confirmation: '',
    contacts: initialContacts && initialContacts.length > 0
      ? initialContacts.map(contact => ({
          ...contact,
          profile: null,
          profile_removed: false,
          addresses: contact.addresses || [],
        }))
      : [],
  };

  const { data, setData, post, patch, processing, errors, reset } = useForm<ProfileFormData>(initialFormData);

  const [profilePreviews, setProfilePreviews] = useState<Record<number, string | null>>(() => {
    const previews: Record<number, string | null> = {};
    initialContacts.forEach((contact, index) => {
      if (typeof contact.profile === 'string' && contact.profile) {
        previews[index] = `/storage/${contact.profile}`;
      }
    });
    return previews;
  });

  const [openContactIndexes, setOpenContactIndexes] = useState<number[]>([]);
  const [openAddressIndexes, setOpenAddressIndexes] = useState<Record<number, number[]>>({});

  const toggleContactForm = (index: number): void => setOpenContactIndexes(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  const toggleAddressForm = (contactIndex: number, addressIndex: number): void => {
      setOpenAddressIndexes(prev => {
          const currentOpen = prev[contactIndex] || [];
          return {
              ...prev,
              [contactIndex]: currentOpen.includes(addressIndex) ? currentOpen.filter(i => i !== addressIndex) : [...currentOpen, addressIndex],
          };
      });
  };
  const handleContactChange = (index: number, field: keyof Omit<ContactProps, 'addresses' | 'profile_removed'>, value: string | File | null): void => setData(prevData => ({ ...prevData, contacts: prevData.contacts.map((contact, i) => i === index ? { ...contact, [field]: value } : contact) }));
  const handleAddressChange = (contactIndex: number, addressIndex: number, field: keyof AddressProps, value: string): void => setData(prevData => ({ ...prevData, contacts: prevData.contacts.map((contact, i) => i === contactIndex ? { ...contact, addresses: contact.addresses.map((address, j) => j === addressIndex ? { ...address, [field]: value } : address) } : contact) }));
  const handleAddContact = (): void => {
    const newContactIndex = data.contacts.length;
    setData('contacts', [...data.contacts, { id: undefined, name: '', phone: '', gender: 'MAN', birthday: '', profile: null, profile_removed: false, addresses: [] }]);
    setOpenContactIndexes(prev => [...prev, newContactIndex]);
  };
  const handleRemoveContact = (index: number): void => {
    if (confirm('Anda yakin ingin menghapus kontak ini beserta semua alamatnya?')) {
        setData('contacts', data.contacts.filter((_, i) => i !== index));
        setOpenContactIndexes(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
        setProfilePreviews(prev => {
            const newPreviews: Record<number, string | null> = {};
            Object.keys(prev).forEach(keyStr => {
                const key = parseInt(keyStr);
                if (key < index) newPreviews[key] = prev[key];
                if (key > index) newPreviews[key - 1] = prev[key];
            });
            return newPreviews;
        });
    }
  };
  const handleAddAddress = (contactIndex: number): void => {
    const newAddressIndex = data.contacts[contactIndex].addresses.length;
    setData('contacts', data.contacts.map((contact, i) => i === contactIndex ? { ...contact, addresses: [...contact.addresses, { id: undefined, post_code: '', country: '', province: '', city: '', street: '', more: '' }] } : contact));
    toggleAddressForm(contactIndex, newAddressIndex);
  };
  const handleRemoveAddress = (contactIndex: number, addressIndex: number): void => {
    if (confirm('Anda yakin ingin menghapus alamat ini?')) {
        setData('contacts', data.contacts.map((contact, i) => i === contactIndex ? { ...contact, addresses: contact.addresses.filter((_, j) => j !== addressIndex) } : contact));
    }
  };
  const handleFileChange = (contactIndex: number, e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setData(prev => ({ ...prev, contacts: prev.contacts.map((c, i) => i === contactIndex ? {...c, profile: file, profile_removed: false} : c) }));
        setProfilePreviews(prev => ({ ...prev, [contactIndex]: URL.createObjectURL(file) }));
    }
  };
  const handleRemoveProfile = (contactIndex: number): void => {
    if (confirm('Anda yakin ingin menghapus foto profil kontak ini?')) {
        setData(prev => ({ ...prev, contacts: prev.contacts.map((c, i) => i === contactIndex ? {...c, profile: null, profile_removed: true} : c) }));
        setProfilePreviews(prev => ({ ...prev, [contactIndex]: null }));
    }
  };
  const handleAccountSubmit = (e: FormEvent): void => {
    e.preventDefault();
    patch(route('profile.account.update'), { preserveScroll: true, onSuccess: () => { alert('Informasi akun berhasil diperbarui.'); reset('password', 'password_confirmation'); }, onError: (errs) => { const errorMessages = Object.values(errs).flat().join('\n'); alert('Gagal memperbarui akun. Mohon perbaiki kesalahan berikut:\n' + errorMessages); } });
  };
  const handleProfileSubmit = (e: FormEvent): void => {
    e.preventDefault();
    post(route('profile.profile.update'), { preserveScroll: true, onSuccess: (page: Page<ProfilePageProps>) => { if (page.props.flash?.success) { alert(page.props.flash.success); } }, onError: (errs) => { const errorMessages = Object.values(errs).flat().join('\n'); alert('Gagal memperbarui profil. Mohon perbaiki kesalahan berikut:\n' + errorMessages); } });
  };
  const formatAddress = (addressItem: AddressProps): string => {
    const parts = [addressItem.street, addressItem.city, addressItem.province, addressItem.country, addressItem.post_code, addressItem.more].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Klik untuk mengisi alamat';
  };

  const cardClasses = "bg-white rounded-lg shadow-sm p-6";
  const cardTitleClasses = "text-lg font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-6";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";
  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#51793E] focus:border-[#51793E] text-gray-900 transition-colors duration-200";
  const primaryButtonClasses = "px-6 py-2 bg-[#51793E] text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#51793E] disabled:opacity-50 transition-colors duration-200 flex items-center justify-center";
  const errorClasses = "text-red-500 text-sm mt-1";


  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Profil Saya" />

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#51793E]">{data.username}</h1>
                <p className="text-sm text-gray-500">{data.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-6">
        <form onSubmit={handleProfileSubmit} noValidate>
          <div className="space-y-6">
            <div className={cardClasses}>
              <h3 className={cardTitleClasses}>Informasi Akun Pengguna</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Username</label>
                  <input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className={inputClasses}/>
                  {errors.username && <p className={errorClasses}>{errors.username}</p>}
                </div>
                <div>
                  <label className={labelClasses}>Email</label>
                  <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClasses}/>
                  {errors.email && <p className={errorClasses}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClasses}>Password Baru</label>
                  <input type="password" value={data.password || ''} onChange={(e) => setData('password', e.target.value)} className={inputClasses} placeholder="Biarkan kosong jika tidak diubah" />
                  {errors.password && <p className={errorClasses}>{errors.password}</p>}
                </div>
                <div>
                  <label className={labelClasses}>Konfirmasi Password</label>
                  <input type="password" value={data.password_confirmation || ''} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClasses} placeholder="Ulangi password baru" />
                  {errors.password_confirmation && <p className={errorClasses}>{errors.password_confirmation}</p>}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button type="button" onClick={handleAccountSubmit} disabled={processing} className={primaryButtonClasses}>
                  {processing ? 'Menyimpan...' : 'Simpan Akun'}
                </button>
              </div>
            </div>

            <div className={cardClasses}>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Kontak & Alamat Saya</h3>
                <button type="button" onClick={handleAddContact} className={`${primaryButtonClasses} px-4 text-sm`}>
                  <PlusCircle className="w-4 h-4 mr-2" /> Tambah Kontak
                </button>
              </div>
              {data.contacts.length === 0 && <p className="text-gray-500 text-sm">Belum ada kontak tersimpan.</p>}

              {data.contacts.map((contact, contactIndex) => (
                <div key={contact.id || `new-${contactIndex}`} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="p-4 cursor-pointer hover:bg-gray-50 relative transition-colors duration-200" onClick={() => toggleContactForm(contactIndex)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 transition-colors duration-200 ${openContactIndexes.includes(contactIndex) ? 'bg-[#51793E]' : 'bg-gray-200'}`}>
                            <ContactIcon className={`w-4 h-4 ${openContactIndexes.includes(contactIndex) ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{contact.name || `Kontak Baru ${contactIndex + 1}`}</p>
                          {!openContactIndexes.includes(contactIndex) && <p className="text-sm text-gray-600 mt-1 truncate max-w-md">{contact.phone || 'Klik untuk mengisi detail'}</p>}
                        </div>
                      </div>
                      {openContactIndexes.includes(contactIndex) ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveContact(contactIndex); }} className="absolute top-3 right-10 text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors duration-200"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  {openContactIndexes.includes(contactIndex) && (
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClasses}>Nama Kontak</label>
                          <input type="text" value={contact.name} onChange={(e) => handleContactChange(contactIndex, 'name', e.target.value)} className={inputClasses} />
                          {errors[`contacts.${contactIndex}.name`] && <p className={errorClasses}>{errors[`contacts.${contactIndex}.name`]}</p>}
                        </div>
                        <div>
                          <label className={labelClasses}>No. Handphone</label>
                          <input type="tel" value={contact.phone} onChange={(e) => handleContactChange(contactIndex, 'phone', e.target.value)} className={inputClasses} />
                           {errors[`contacts.${contactIndex}.phone`] && <p className={errorClasses}>{errors[`contacts.${contactIndex}.phone`]}</p>}
                        </div>
                        <div>
                          <label className={labelClasses}>Jenis Kelamin</label>
                          <select value={contact.gender} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleContactChange(contactIndex, 'gender', e.target.value as 'MAN' | 'WOMAN')} className={inputClasses}>
                            <option value="MAN">Laki-laki</option>
                            <option value="WOMAN">Perempuan</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClasses}>Tanggal Lahir</label>
                          <input type="date" value={contact.birthday} onChange={(e) => handleContactChange(contactIndex, 'birthday', e.target.value)} className={inputClasses} />
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelClasses}>Foto Profil</label>
                          <input type="file" accept="image/*" onChange={(e) => handleFileChange(contactIndex, e)} className={`${inputClasses} file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#51793E] hover:file:bg-green-100`} />
                          {errors[`contacts.${contactIndex}.profile`] && <p className={errorClasses}>{errors[`contacts.${contactIndex}.profile`]}</p>}
                          {profilePreviews[contactIndex] && (
                            <div className="mt-3 flex items-center space-x-3">
                              <img src={profilePreviews[contactIndex]!} alt="Preview" className="w-16 h-16 rounded-full object-cover shadow-sm" />
                              <button type="button" onClick={() => handleRemoveProfile(contactIndex)} className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center transition-colors duration-200"><XCircle className="w-4 h-4 mr-1" />Hapus Foto</button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-semibold text-gray-800">Alamat Kontak</h4>
                          <button type="button" onClick={() => handleAddAddress(contactIndex)} className={`${primaryButtonClasses} px-3 py-1 text-sm`}>
                            <PlusCircle className="w-4 h-4 mr-1.5" />Tambah Alamat
                          </button>
                        </div>
                        {contact.addresses.length === 0 && <p className="text-gray-500 text-sm">Belum ada alamat untuk kontak ini.</p>}

                        {contact.addresses.map((address, addressIndex) => (
                          <div key={address.id || `new-addr-${addressIndex}`} className="border rounded-lg mb-3 bg-white">
                            <div className="p-3 cursor-pointer hover:bg-gray-50 relative transition-colors duration-200" onClick={() => toggleAddressForm(contactIndex, addressIndex)}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 transition-colors duration-200 ${openAddressIndexes[contactIndex]?.includes(addressIndex) ? 'bg-[#51793E]' : 'bg-gray-300'}`}>
                                    <MapPin className={`w-3 h-3 ${openAddressIndexes[contactIndex]?.includes(addressIndex) ? 'text-white' : 'text-gray-600'}`} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">Alamat {addressIndex + 1}</p>
                                    {!openAddressIndexes[contactIndex]?.includes(addressIndex) && <p className="text-sm text-gray-600 mt-1 truncate max-w-xs">{formatAddress(address)}</p>}
                                  </div>
                                </div>
                                {openAddressIndexes[contactIndex]?.includes(addressIndex) ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
                              </div>
                               <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveAddress(contactIndex, addressIndex); }} className="absolute top-2 right-9 text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors duration-200"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            {openAddressIndexes[contactIndex]?.includes(addressIndex) && (
                              <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50">
                                <div>
                                  <label className={labelClasses}>Kode Pos</label>
                                  <input type="text" value={address.post_code} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'post_code', e.target.value)} className={inputClasses} />
                                  {errors[`contacts.${contactIndex}.addresses.${addressIndex}.post_code`] && <p className={errorClasses}>{errors[`contacts.${contactIndex}.addresses.${addressIndex}.post_code`]}</p>}
                                </div>
                                <div>
                                  <label className={labelClasses}>Negara</label>
                                  <input type="text" value={address.country} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'country', e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                  <label className={labelClasses}>Provinsi</label>
                                  <input type="text" value={address.province} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'province', e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                  <label className={labelClasses}>Kota</label>
                                  <input type="text" value={address.city} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'city', e.target.value)} className={inputClasses} />
                                </div>
                                <div className="md:col-span-2">
                                  <label className={labelClasses}>Jalan</label>
                                  <input type="text" value={address.street} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'street', e.target.value)} className={inputClasses} />
                                </div>
                                <div className="md:col-span-2">
                                  <label className={labelClasses}>Detail Tambahan (Gedung, No. Unit)</label>
                                  <input type="text" value={address.more} onChange={(e) => handleAddressChange(contactIndex, addressIndex, 'more', e.target.value)} className={inputClasses} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={processing} className={`${primaryButtonClasses} w-full md:w-auto`}>
                {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;