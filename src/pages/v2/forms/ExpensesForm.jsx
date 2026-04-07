import React, { useState, useEffect } from 'react';
import { Icons } from '../../../assets/Icons';
import Modal from '../../../components/modal/Modal';
import UploadImage from '../../../library/gemini/RecieptScanner';
import { LuPlus, LuMinus, LuBadgePercent, LuCheck, LuWallet, LuCalendar } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { expensesTracker, getExpenses, getAllDataActiveRealTimeController } from '../../../library/firebase/controller';
import { getTodayDate, generateUniqueID } from '../../../library/utils';
import '../../../css/v2/form.css';
import { expensesCategoryStore } from '../../../library/zustand/storage';

const ExpensesForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    const [categories, setCategories] = useState([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isModalOpenAI, setIsModalOpenAI] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const storedCategories = expensesCategoryStore((state) => state.data) || [];
    const handleAiData = (data) => {
        // setRows(data); // This fills your form automatically!

        if (data.items.length > 0) {
            console.log(data);
            if (rows.length === 1 && !rows[0].description) setRows([]);
            for (const item of data.items) {
                console.log(item);
                setRows(rows => [...rows, {
                    id: generateUniqueID(),
                    categoryId: item.categoryId,
                    categoryName: item.categoryName,
                    description: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount,
                    showDiscount: false
                }]);
            }
            setIsModalOpenAI(false);
        } else {
            console.log('No data found');
        }
    };
    // const buttonClick = () => {
    //     // console.log('button clicked', rows);
    //     // console.log('data', data);
    //     const fetchedData = [];
    //     for (const item of data) {
    //         fetchedData.push({ id: item.id, name: item.category });
    //     }
    //     console.log('data', fetchedData);
    //     console.log('data', JSON.stringify(fetchedData, null, 2));
    // };
    // Header state
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState('');
    const [wallets, setWallets] = useState([]);
    const [isWalletsFetching, setIsWalletsFetching] = useState(true);

    // Manage multiple rows
    const [rows, setRows] = useState([
        { id: generateUniqueID(), categoryId: '', categoryName: '', description: '', quantity: '', price: '', discount: '', showDiscount: false }
    ]);

    useEffect(() => {
        const fetchInitialData = async () => {
            await getExpenses(paramMonth, setCategories, setIsFetchingCategories, true);
            await getAllDataActiveRealTimeController('wallets', setWallets, setIsWalletsFetching);
        };
        fetchInitialData();
    }, [paramMonth]);

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const addRow = () => {
        setRows([...rows, { id: generateUniqueID(), categoryId: '', categoryName: '', description: '', quantity: '', price: '', discount: '', showDiscount: false }]);
    };

    const toggleDiscount = (id) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, showDiscount: !row.showDiscount } : row
        ));
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            setRows([{ id: generateUniqueID(), categoryId: '', categoryName: '', description: '', quantity: '', price: '', discount: '', showDiscount: false }]);
        }
    };

    const handleSubmitAll = async () => {

        if (!selectedWallet) {
            alert("Please select a wallet");
            return;
        }

        const invalidRows = rows.filter(row => !row.categoryId || !row.description || !row.price);
        if (invalidRows.length > 0) {
            alert("Please fill in all fields (Category, Description, Price) for all rows.");
            return;
        }

        setLoading(true);
        let successCount = 0;

        for (const row of rows) {
            const data = {
                category: row.categoryId,
                description: row.description,
                price: parseFloat(row.price),
                discount: row.discount ? parseFloat(row.discount) : 0,
                date: headerDate,
                wallet: selectedWallet
            };

            const result = await expensesTracker(data);
            if (result.status === 'success') {
                successCount++;
                console.log(result);
            }
        }

        setLoading(false);
        if (successCount === rows.length) {
            console.log('success')
            if (onFinish) onFinish();
            setRows([{ id: generateUniqueID(), categoryId: '', categoryName: '', description: '', quantity: '', price: '', discount: '', showDiscount: false }]);
        } else if (successCount > 0) {
            alert(`Successfully added ${successCount} of ${rows.length} expenses.`);
        } else {
            alert(`Failed to add expenses.`);
        }
    };

    return (
        <div className="shared-form-container-v2">
            {/* Header Section */}
            {/* <button onClick={buttonClick}>
                Click me
            </button> */}
            <>
                <button
                    // onClick={() => setIsSettingsOpen(true)}
                    onClick={() => setIsModalOpenAI(true)}
                    className="w-full p-4 rounded-2xl bg-[var(--color-theme-secondary)] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Icons.LuSparkles size={20} />
                        </div>
                        <div>
                            <div className="text-[var(--color-light)] font-bold">AI Receipt Scanner</div>
                            <div className="text-[var(--color-theme-secondary-text)] text-xs">Auto-extract details from photos</div>
                        </div>
                    </div>
                    <Icons.LuArrowLeft className="rotate-180 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <div className="h-[1px] bg-white/5 w-full my-2" />
            </>
            <Modal
                title={'AI Receipt Scanner'}
                isModalOpen={isModalOpenAI}
                onClose={() => setIsModalOpenAI(false)}
                fullscreen={false}
                maxWidth='550px'
                closeOnOverlay={false}
                // closeOnOverlay={!isBottomSheetOpen}
                zIndex={6000}
            >
                <UploadImage onDataExtracted={handleAiData} />
            </Modal>
            <div className="shared-form-header-v2">
                <div className="flex items-center flex-1">
                    <LuCalendar className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <input
                        type="date"
                        className="header-field-v2"
                        value={headerDate}
                        onChange={(e) => setHeaderDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center flex-1">
                    <LuWallet className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                    <select
                        className="header-field-v2"
                        value={selectedWallet}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                    >
                        <option value="" disabled>Select Wallet</option>
                        {wallets.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Rows List */}
            <div className="shared-form-body">
                {rows.map((row, index) => (
                    <div key={row.id} className="shared-form-row-v2">
                        <div className="shared-form-input-group-v2">
                            <select
                                className="shared-form-field-v2 field-category-v2"
                                value={row.categoryId}
                                onChange={(e) => handleInputChange(row.id, 'categoryId', e.target.value)}
                            >
                                <option value="" disabled defaultValue>Category</option>
                                {/* {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.category}
                                    </option>
                                ))} */}
                                {storedCategories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.category}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                className="shared-form-field-v2 field-description-v2"
                                placeholder="Description"
                                value={row.description}
                                onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                            />
                            <input
                                type="number"
                                className="shared-form-field-v2 field-qty-v2"
                                placeholder="Qty"
                                value={row.quantity}
                                onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                            />
                            <input
                                type="number"
                                className="shared-form-field-v2 field-price-v2"
                                placeholder="Price"
                                value={row.price}
                                onChange={(e) => handleInputChange(row.id, 'price', e.target.value)}
                            />

                            {row.showDiscount && (
                                <input
                                    type="number"
                                    className="shared-form-field-v2 field-discount-v2"
                                    placeholder="Disc"
                                    value={row.discount}
                                    onChange={(e) => handleInputChange(row.id, 'discount', e.target.value)}
                                />
                            )}
                        </div>

                        <div className="shared-form-actions-v2">
                            <button
                                className={`shared-form-action-btn-v2 btn-discount-v2 ${row.showDiscount ? 'active-v2' : ''}`}
                                onClick={() => toggleDiscount(row.id)}
                                title="Add Discount"
                            >
                                <LuBadgePercent size={18} />
                            </button>
                            <button
                                className="shared-form-action-btn-v2 btn-remove-v2"
                                onClick={() => removeRow(row.id)}
                                title="Remove Row"
                            >
                                <LuMinus size={18} />
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Button */}
            <button className="shared-form-add-more-v2" onClick={addRow}>
                <LuPlus size={18} />
                <span>Add Item</span>
            </button>

            {/* Footer Submit */}
            <div className="shared-form-footer-v2">
                <button
                    className={`shared-form-submit-all-v2 ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitAll}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Save Expenses'}
                </button>
            </div>
        </div>
    );
};

export default ExpensesForm;
