import React, { useState, useEffect } from 'react';
import { Icon } from '../../../assets/Icons';
import Modal from '../../../components/modal/Modal';
import UploadImage from '../../../library/gemini/RecieptScanner';
import { LuPlus, LuMinus, LuBadgePercent, LuCheck, LuWallet, LuCalendar } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { addExpenses } from '../../../library/firebase/v3/controller';
import { getTodayDate, generateUniqueID, accurateDecimal } from '../../../library/utils';
import '../../../css/v2/form.css';
import { categoriesStore, walletStorage } from '../../../library/zustand/storage';
import CategoryForm from './CategoryForm';
import Big from "big.js";
import Calculator from '../../../components/Calculator';

const ExpenseForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    const [loading, setLoading] = useState(false);
    const [isModalOpenAI, setIsModalOpenAI] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
    const [activeCalcRowId, setActiveCalcRowId] = useState(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const storedCategories = categoriesStore((state) => state.data) || [];
    const storedWallets = walletStorage((state) => state.data) || [];
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState(storedWallets[storedWallets.length - 1].id);
    const [viewMode, setViewMode] = useState('list');

    // AI Data Handler
    const handleAiData = (data) => {
        if (data.items.length > 0) {
            console.log(data);
            if (rows.length === 1 && !rows[0].description) setRows([]);
            for (const item of data.items) {
                console.log(item);
                setRows(rows => [...rows, {
                    id: generateUniqueID(),
                    categoryId: item.categoryId,
                    description: item.name,
                    // Use Big.js for calculation to maintain precision
                    price: item.quantity
                        ? accurateDecimal(item.quantity).times(accurateDecimal(item.price))
                        : accurateDecimal(item.price),
                    discount: accurateDecimal(item.discount),
                    showDiscount: item.discount > 0 ? true : false
                }]);
                console.log('rows', rows)
            }
            setIsModalOpenAI(false);
        } else {
            console.log('No data found');
        }
    };

    // Manage multiple rows
    const maxSingleRow = 3;
    const [rows, setRows] = useState([
        { id: generateUniqueID(), categoryId: '', description: '', price: '', discount: '', showDiscount: false }
    ]);

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const addRow = () => {
        setRows([...rows, { id: generateUniqueID(), categoryId: '', description: '', price: '', discount: '', showDiscount: false }]);
    };

    const toggleDiscount = (id) => {
        setRows(rows.map(row =>
            row.id === id ? {
                ...row,
                discount: '',
                showDiscount: !row.showDiscount
            } : row
        ));
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            handleClear();
        }
    };

    const handleClear = () => {
        setRows([{ id: generateUniqueID(), categoryId: '', description: '', price: '', discount: '', showDiscount: false }]);
    };

    const calculateTotal = () => {
        return rows.reduce((sum, row) => {
            const price = parseFloat(row.price) || 0;
            const discount = parseFloat(row.discount) || 0;
            return sum + (price - discount);
        }, 0);
    };

    const handleSubmitAll = async () => {

        if (!selectedWallet) {
            alert("Please select a wallet");
            return;
        }
        if (!headerDate) {
            alert("Please select a date");
            return;
        }

        const invalidRows = rows.filter(row => !row.categoryId || !row.description || accurateDecimal(row.price).toNumber() === 0);
        if (invalidRows.length > 0) {
            alert("Please fill in all fields (Category, Description, Price) for all rows.");
            return;
        }

        // setLoading(true);
        // let successCount = 0;
        // console.log(rows)
        // for (const row of rows) {
        //     const data = {
        //         category: row.categoryId,
        //         description: row.description,
        //         amount: new Big(row.price || 0),
        //         discount: row.discount ? new Big(row.discount) : new Big(0),
        //         wallet: selectedWallet,
        //         date: headerDate
        //     };

        //     console.log(data);
        //     const result = await addExpenses(data);
        //     // console.log(result)
        //     // const result = await expensesTracker(data);
        //     // if (result.status === 'success') {
        //     //     successCount++;
        //     //     console.log(result);
        //     // }
        // }
        // console.log('rowssssssssssssssssss', rows)
        // console.log(accurateDecimal(storedWallets.find((wallet) => wallet.id === selectedWallet).balance));
        try {
            setLoading(true);
            const result = await addExpenses(rows, headerDate, selectedWallet,
                accurateDecimal(storedWallets.find((wallet) => wallet.id === selectedWallet).balance)
            );
            console.log('result', result)
            if (result.boolean)
                handleClear();
            alert(result.message);
        } catch (error) {
            console.log('error', error)
            alert('Failed to add expense.');
        } finally {
            setLoading(false);
        }
        // if (successCount === rows.length) {
        //     console.log('success')
        //     if (onFinish) onFinish();
        //     setRows([{ id: generateUniqueID(), categoryId: '', categoryName: '', description: '', quantity: '', price: '', discount: '', showDiscount: false }]);
        // } else if (successCount > 0) {
        //     console.log(`Successfully added ${successCount} of ${rows.length} expenses.`);
        // } else {
        //     console.log(`Failed to add expenses.`);
        // }
    };
    const gridList = () => {
        setViewMode(prev => prev === 'list' ? 'grid' : 'list');
        console.log(viewMode === 'list' ? 'grid' : 'list');
    }

    return (
        <>
            <div className="shared-form-container-v3">
                {/* AI Button */}
                <button
                    // onClick={() => setIsSettingsOpen(true)}
                    onClick={() => setIsModalOpenAI(true)}
                    className="w-full p-4 rounded-2xl bg-[var(--color-theme-secondary)] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Icon name="LuSparkles" size={20} />
                        </div>
                        <div>
                            <div className="text-[var(--color-light)] font-bold">AI Receipt Scanner</div>
                            <div className="text-[var(--color-theme-secondary-text)] text-xs">Auto-extract details from photos</div>
                        </div>
                    </div>
                    <Icon name="LuArrowLeft" size={20} className="rotate-180 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <div className="h-[1px] bg-white/5 w-full my-2" />

                <div className="shared-form-header-v3">
                    <div className="flex items-center flex-1">
                        <Icon name="LuCalendar" size={16} className="ml-3 text-[var(--color-theme-secondary-text)]" />
                        <input
                            type="date"
                            className="header-field-v3"
                            value={headerDate}
                            onChange={(e) => setHeaderDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center flex-1">
                        <Icon name="LuWallet" size={16} className="ml-3 text-[var(--color-theme-secondary-text)]" />
                        <select
                            className="header-field-v3"
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                        >
                            {storedWallets && storedWallets.length > 0 ? (
                                storedWallets.map((wallet, index) => (
                                    wallet.status === 'active' && (
                                        <option key={index} value={wallet.id}>{wallet.name}</option>
                                    )
                                )).reverse()
                            ) :
                                <option value="" disabled>No Wallets Found</option>
                            }
                        </select>
                    </div>
                </div>

                {/* Total and Clear Actions */}
                <div className="flex justify-between items-center ">
                    <div className="text-m font-bold text-[var(--color-light)] flex items-center gap-2">
                        Total: <span className="text-yellow-500">{calculateTotal()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <button
                            type="button"
                            onClick={gridList}
                            className="relative flex items-center bg-white/5 rounded-xl p-1 cursor-pointer transition-colors hover:bg-white/10"
                        >
                            <div
                                className={`absolute left-1 top-1 w-7 h-7 bg-white/10 rounded-lg transition-transform duration-200 ease-out ${viewMode === 'list' ? 'translate-x-full' : 'translate-x-0'
                                    }`}
                            />

                            <div
                                className={`relative z-10 p-1.5 transition-colors duration-200 ${viewMode === 'grid' ? 'text-[var(--color-light)]' : 'text-white/40'}`}
                            >
                                <Icon name="LuLayoutGrid" size={16} />
                            </div>
                            <div
                                className={`relative z-10 p-1.5 transition-colors duration-200 ${viewMode === 'list' ? 'text-[var(--color-light)]' : 'text-white/40'}`}
                            >
                                <Icon name="LuList" size={16} />
                            </div>
                        </button> */}
                        <button
                            onClick={handleClear}
                            className="btn-remove-all-v3 px-3 h-9 gap-2"
                        >
                            <Icon name="LuTrash2" size={16} />
                            Clear
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                {rows.length >= maxSingleRow && (
                    <div className="shared-form-table-header-v3">
                        <div className="shared-form-input-group-v3" style={{ background: 'transparent', border: 'none', borderRadius: 0 }}>
                            <div className="form-header-title" style={{ flex: 1 }}>Category</div>
                            <div className="form-header-title field-description-v3">Name / Description</div>
                            <div className="form-header-title field-price-v3">Price</div>
                            {/* <div className="form-header-title field-price-v3">Discount</div> */}
                        </div>
                        <div className="shared-form-actions-v3">
                            <div style={{ width: '36px' }}></div>
                        </div>
                    </div>
                )}

                {/* Rows List */}
                <div className="shared-form-body">
                    {rows.map((row, index) => (
                        <div key={index} className={`shared-form-row-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                            <div className={`shared-form-input-group-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                                <select
                                    className={`shared-form-field-v3 field-category-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    value={row.categoryId}
                                    onChange={(e) => {
                                        if (e.target.value === 'CREATE_NEW') {
                                            setIsCategoryModalOpen(true);
                                            handleInputChange(row.id, 'categoryId', '');
                                        } else {
                                            handleInputChange(row.id, 'categoryId', e.target.value);
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="CREATE_NEW">➕ Add New Category...</option>

                                    {storedCategories.map((item, index) =>
                                        item.type === 'expense' && (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        )
                                    )}
                                </select>

                                <input
                                    type="text"
                                    className={`shared-form-field-v3 field-description-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    placeholder="Name / Description"
                                    value={row.description}
                                    onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                                />
                                {/* <input
                                    type="number"
                                    className={`shared-form-field-v3 field-qty-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    placeholder="Qty"
                                    value={row.quantity}
                                    onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                                /> */}
                                <div className={`flex items-center shared-form-field-v3 field-price-v3 p-0 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                                    <input
                                        type="number"
                                        className="w-full bg-transparent border-none outline-none text-inherit placeholder-inherit min-w-0"
                                        placeholder="Price"
                                        value={row.price}
                                        onChange={(e) => handleInputChange(row.id, 'price', accurateDecimal(e.target.value))}
                                    />
                                    <button
                                        type="button"
                                        className="flex-shrink-0 text-[var(--color-theme-secondary-text)] hover:text-[var(--color-theme-important)] transition-colors pr-[0.6rem]"
                                        onClick={() => {
                                            setActiveCalcRowId(row.id);
                                            setIsCalcModalOpen(true);
                                        }}
                                        title="Open Calculator"
                                    >
                                        <Icon name="LuCalculator" size={16} />
                                    </button>
                                </div>

                                {row.showDiscount && (
                                    <input
                                        type="number"
                                        className={`shared-form-field-v3 field-discount-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                        placeholder="Disc"
                                        value={row.discount}
                                        onChange={(e) => handleInputChange(row.id, 'discount', accurateDecimal(e.target.value))}
                                    />
                                )}
                            </div>

                            <div className="shared-form-actions-v3">
                                <button
                                    className={`shared-form-action-btn-v3 btn-discount-v3 
                                    ${row.showDiscount ? 'active-v3' : ''} 
                                    ${rows.length < maxSingleRow ? 'single' : ''}
                                    `}
                                    onClick={() => toggleDiscount(row.id)}
                                    title="Add Discount"
                                >
                                    <Icon name="LuBadgePercent" size={18} />
                                </button>
                                <button
                                    className={`shared-form-action-btn-v3 btn-remove-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    onClick={() => removeRow(row.id)}
                                    title="Remove Row"
                                >
                                    <Icon name="LuMinus" size={18} />
                                </button>

                            </div>
                        </div>
                    ))}
                </div>

                <button className="shared-form-add-more-v3" onClick={addRow}>
                    <Icon name="LuPlus" size={18} />
                    <span>Add Item</span>
                </button>

                <div className="shared-form-footer-v3">
                    <button
                        className={`shared-form-submit-all-v3 ${loading ? 'loading' : ''}`}
                        onClick={handleSubmitAll}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Save Expenses'}
                    </button>
                </div>
            </div>
            {/* AI Modal */}
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
            {/* Create Category Modal */}
            <Modal
                title={'Create Category Expense'}
                isModalOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                fullscreen={false}
                maxWidth='550px'
                closeOnOverlay={false}
                // closeOnOverlay={!isBottomSheetOpen}
                zIndex={6000}
            >
                <CategoryForm typeSelected="expense" />
            </Modal>
            {/* Calculator Modal */}
            <Modal
                // title={'Calculator'}
                isModalOpen={isCalcModalOpen}
                onClose={() => setIsCalcModalOpen(false)}
                fullscreen={false}
                bodyFullscreen={true}
                maxWidth='425px'
                closeOnOverlay={false}
                zIndex={6000}
            >
                {activeCalcRowId && (
                    <Calculator
                        key={isCalcModalOpen ? activeCalcRowId : 'closed'}
                        initialValue={String(rows.find(r => r.id === activeCalcRowId)?.price || '0')}
                        onEquals={(val) => {
                            handleInputChange(activeCalcRowId, 'price', val);
                            setIsCalcModalOpen(false);
                        }}
                    />
                )}
            </Modal>
        </>
    );
};

export default ExpenseForm;
