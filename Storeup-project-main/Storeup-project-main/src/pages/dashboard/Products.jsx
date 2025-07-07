import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { getProducts, deleteProduct } from '../../features/products/productsSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { currentStore } = useSelector((state) => state.store);
  const { products, loading } = useSelector((state) => state.products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  useEffect(() => {
    if (currentStore?.id) {
      dispatch(getProducts(currentStore.id));
    }
  }, [dispatch, currentStore]);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle nested fields like price
    if (sortField === 'price' || sortField === 'salePrice') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = typeof bValue === 'string' ? bValue.toLowerCase() : '';
    }
    
    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const filteredProducts = sortedProducts.filter(
    (product) =>
      (product.name && String(product.name).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.sku && String(product.sku).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category && String(product.category).toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct({ productId: productToDelete.id }));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };
  
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return null;
    }
    
    return sortDirection === 'asc' ? (
      <ArrowUpIcon className="h-4 w-4 inline-block ml-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 inline-block ml-1" />
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">المنتجات</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link
            to="/dashboard/products/add"
            className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon className="h-5 w-5 ml-2" />
            إضافة منتج
          </Link>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-soft">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="product-search"
              name="product-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pr-10 w-full"
              placeholder="ابحث عن اسم المنتج، الرقم التسلسلي، أو الفئة"
            />
          </div>
        </div>
      </div>
      
      {/* Products table */}
      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <PlusCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">لا توجد منتجات</h3>
            <p className="mt-1 text-sm text-gray-500">
              ابدأ بإضافة منتجات لمتجرك لعرضها هنا.
            </p>
            <div className="mt-6">
              <Link
                to="/dashboard/products/add"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 ml-2" />
                إضافة أول منتج
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    اسم المنتج
                    <SortIcon field="name" />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('sku')}
                  >
                    الرقم التسلسلي
                    <SortIcon field="sku" />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    السعر
                    <SortIcon field="price" />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    الكمية
                    <SortIcon field="quantity" />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    الفئة
                    <SortIcon field="category" />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={
                              (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0]?.image_url) ||
                              product.image_url ||
                              'https://placehold.co/150x150?text=صورة+المنتج'
                            }
                            alt={product.name || 'صورة المنتج'}
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/150x150?text=صورة+المنتج';
                            }}
                          />
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.salePrice ? (
                        <div>
                          <span className="text-sm line-through text-gray-500">${parseFloat(product.price).toFixed(2)}</span>
                          <span className="text-sm font-semibold text-red-600 mr-1">
                            ${parseFloat(product.salePrice).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">${parseFloat(product.price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-right">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    تأكيد حذف المنتج
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      هل أنت متأكد من رغبتك في حذف منتج "{productToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mr-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  حذف
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={cancelDelete}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 