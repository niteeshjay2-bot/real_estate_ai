import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', property_type: 'apartment', listing_type: 'sale',
    price: '', area_sqft: '', carpet_area: '', state: '', city: '', locality: '',
    address: '', pincode: '', bedrooms: '2', bathrooms: '2', balconies: '1',
    floor_number: '', total_floors: '', facing: '', age_of_property: '0',
    furnishing: 'unfurnished', negotiable: true,
    has_lift: false, has_car_parking: false, has_bike_parking: false,
    has_power_backup: false, has_security: false, has_gym: false,
    has_swimming_pool: false, has_club_house: false, has_cctv: false,
    has_garden: false, has_water_supply: false, road_width: '', is_corner_plot: false,
  });

  const states = ['Maharashtra', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Delhi', 'Haryana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'Punjab', 'Kerala', 'West Bengal'];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'villa', label: 'Villa', icon: '🏡' },
    { value: 'independent_house', label: 'Ind. House', icon: '🏠' },
    { value: 'farm_house', label: 'Farm House', icon: '🌳' },
    { value: 'commercial', label: 'Commercial', icon: '🏪' },
    { value: 'office_space', label: 'Office', icon: '💼' },
    { value: 'warehouse', label: 'Warehouse', icon: '🏭' },
    { value: 'land', label: 'Land', icon: '🌍' },
    { value: 'agricultural_land', label: 'Agri Land', icon: '🌾' },
    { value: 'plot', label: 'Plot', icon: '📐' },
  ];

  const handleSubmit = () => {
    toast.success('Property listed successfully! Pending admin approval.');
    navigate('/properties');
  };

  const showResidentialFields = ['apartment', 'villa', 'independent_house', 'farm_house'].includes(form.property_type);
  const showLandFields = ['land', 'agricultural_land', 'plot'].includes(form.property_type);

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Basic Info</span><span>Details</span><span>Amenities</span>
          </div>
        </div>

        <div className="card-glass p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Property Details'}
            {step === 3 && 'Amenities & Features'}
          </h1>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Property Type</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {propertyTypes.map((type) => (
                    <button key={type.value} type="button"
                      onClick={() => setForm({ ...form, property_type: type.value })}
                      className={`p-3 rounded-xl text-center transition-all ${
                        form.property_type === type.value
                          ? 'bg-primary-600 text-white shadow-lg ring-2 ring-primary-300'
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100'
                      }`}>
                      <span className="text-2xl block">{type.icon}</span>
                      <span className="text-xs font-medium mt-1 block">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Listing Type</label>
                  <select value={form.listing_type} onChange={(e) => setForm({ ...form, listing_type: e.target.value })} className="input-field mt-1">
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field mt-1" placeholder="Enter price" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field mt-1" placeholder="e.g. Luxury 3BHK in Bandra West" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field mt-1" placeholder="Describe your property..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                  <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field mt-1">
                    <option value="">Select State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field mt-1" placeholder="Enter city" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Area (sqft)</label>
                  <input type="number" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: e.target.value })} className="input-field mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Carpet Area (sqft)</label>
                  <input type="number" value={form.carpet_area} onChange={(e) => setForm({ ...form, carpet_area: e.target.value })} className="input-field mt-1" />
                </div>
              </div>

              {showResidentialFields && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms</label>
                      <select value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="input-field mt-1">
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bathrooms</label>
                      <select value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="input-field mt-1">
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Balconies</label>
                      <select value={form.balconies} onChange={(e) => setForm({ ...form, balconies: e.target.value })} className="input-field mt-1">
                        {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Floor</label>
                      <input type="number" value={form.floor_number} onChange={(e) => setForm({ ...form, floor_number: e.target.value })} className="input-field mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Floors</label>
                      <input type="number" value={form.total_floors} onChange={(e) => setForm({ ...form, total_floors: e.target.value })} className="input-field mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Facing</label>
                      <select value={form.facing} onChange={(e) => setForm({ ...form, facing: e.target.value })} className="input-field mt-1">
                        <option value="">Select</option>
                        {['North', 'South', 'East', 'West', 'NE', 'NW', 'SE', 'SW'].map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {showLandFields && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Road Width (ft)</label>
                    <input type="number" value={form.road_width} onChange={(e) => setForm({ ...form, road_width: e.target.value })} className="input-field mt-1" />
                  </div>
                  <label className="flex items-center space-x-2 mt-6">
                    <input type="checkbox" checked={form.is_corner_plot} onChange={(e) => setForm({ ...form, is_corner_plot: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Corner Plot</span>
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Age of Property (years)</label>
                  <input type="number" value={form.age_of_property} onChange={(e) => setForm({ ...form, age_of_property: e.target.value })} className="input-field mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Furnishing</label>
                  <select value={form.furnishing} onChange={(e) => setForm({ ...form, furnishing: e.target.value })} className="input-field mt-1">
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="furnished">Furnished</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'has_lift', label: '🛗 Lift/Elevator' },
                  { key: 'has_car_parking', label: '🚗 Car Parking' },
                  { key: 'has_bike_parking', label: '🏍️ Bike Parking' },
                  { key: 'has_power_backup', label: '⚡ Power Backup' },
                  { key: 'has_security', label: '👮 24/7 Security' },
                  { key: 'has_gym', label: '💪 Gym' },
                  { key: 'has_swimming_pool', label: '🏊 Swimming Pool' },
                  { key: 'has_club_house', label: '🎱 Club House' },
                  { key: 'has_cctv', label: '📹 CCTV' },
                  { key: 'has_garden', label: '🌳 Garden' },
                  { key: 'has_water_supply', label: '💧 24/7 Water' },
                  { key: 'has_gas_pipeline', label: '🔥 Gas Pipeline' },
                ].map(({ key, label }) => (
                  <label key={key}
                    className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all ${
                      form[key] ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500' : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent'
                    }`}>
                    <input type="checkbox" checked={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="btn-secondary">← Previous</button>
            ) : <div></div>}

            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary">Next →</button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary !bg-gradient-to-r !from-green-500 !to-green-600">
                ✓ List Property
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPage;
