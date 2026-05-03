import React, { useState, useEffect } from 'react';
import { LuPlus, LuMinus, LuCheck, LuWallet, LuCalendar, LuBolt } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { getTodayDate, generateUniqueID, accurateDecimal } from '../../../library/utils';
import { walletStorage, categoriesStore } from '../../../library/zustand/storage';
import { Icon } from '../../../assets/Icons';
import Modal from '../../../components/modal/Modal';
import CategoryForm from './CategoryForm';
import Big from "big.js";
import { addBills } from '../../../library/firebase/v3/controller';

const BillsForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    const [loading, setLoading] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const storedWallets = walletStorage((state) => state.data) || [];
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState(storedWallets[storedWallets.length - 1].id);
    const [wallets, setWallets] = useState([]);
    const storedCategories = categoriesStore((state) => state.data) || [];
    const [isWalletsFetching, setIsWalletsFetching] = useState(true);

    // Manage multiple rows
    const maxSingleRow = 3;
    const [rows, setRows] = useState([
        { id: generateUniqueID(), categoryId: '', description: '', expected: '', amount: '', dueDate: getTodayDate(), isRecurring: false }
    ]);

    // useEffect(() => {
    //     const fetchInitialData = async () => {
    //         await getAllDataActiveRealTimeController('wallets', setWallets, setIsWalletsFetching);
    //     };
    //     fetchInitialData();
    // }, []);

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const addRow = () => {
        setRows([...rows, { id: generateUniqueID(), categoryId: '', description: '', expected: '', amount: '', dueDate: getTodayDate(), isRecurring: false }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            setRows([{ id: generateUniqueID(), categoryId: '', description: '', expected: '', amount: '', dueDate: getTodayDate(), isRecurring: false }]);
        }
    };
    const handleClear = () => {
        setRows([{ id: generateUniqueID(), categoryId: '', description: '', expected: '', amount: '', dueDate: getTodayDate(), isRecurring: false }]);
    };

    const handleSubmitAll = async () => {
        if (!headerDate) {
            alert("Please select a date");
            return;
        }

        if (!selectedWallet) {
            alert("Please select a wallet");
            return;
        }

        const invalidRows = rows.filter(row => !row.categoryId || !row.description || accurateDecimal(row.expected).toNumber() === 0 || !row.dueDate);
        if (invalidRows.length > 0) {
            alert("Please fill in (Category, Description, Expected, Due Date) for all rows.");
            return;
        }

        // setLoading(true);
        // let successCount = 0;

        // for (const row of rows) {
        //     const data = {
        //         categoryId: row.categoryId,
        //         description: row.description,
        //         expected: new Big(row.expected),
        //         amount: row.amount ? new Big(row.amount) : new Big(0),
        //         dueDate: row.dueDate,
        //         wallet: selectedWallet,
        //         date: headerDate,
        //     };

        //     // const result = await bills(data);
        //     // if (result.status === 'success') {
        //     //     successCount++;
        //     // }
        // }
        setLoading(true);
        const result = await addBills(rows, headerDate, selectedWallet,
            accurateDecimal(storedWallets.find((wallet) => wallet.id === selectedWallet).balance)
        );
        console.log('result', result)
        if (result.boolean)
            handleClear();
        alert(result.message);
        setLoading(false);

        // if (successCount === rows.length) {
        //     if (onFinish) onFinish();
        //     setRows([{ id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }]);
        // } else if (successCount > 0) {
        //     alert(`Successfully added ${successCount} of ${rows.length} bills.`);
        // }
        // setLoading(false);
    };

    return (
        <>
            <div className="shared-form-container-v3">
                {/* Header Section */}
                <div className="shared-form-header-v3">
                    <div className="flex items-center flex-1">
                        <Icon name="LuCalendar" className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
                        <input
                            type="date"
                            className="header-field-v3"
                            value={headerDate}
                            onChange={(e) => setHeaderDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center flex-1">
                        <Icon name="LuWallet" className="ml-3 text-[var(--color-theme-secondary-text)]" size={16} />
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
                <div className="flex justify-between items-center ">
                    <div className="text-m font-bold text-[var(--color-light)] flex items-center gap-2">

                    </div>
                    <div className="flex items-center gap-3">
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
                            <div className="form-header-title min-w-[90px]">Category</div>
                            <div className="form-header-title min-w-[60px]">Name / Desc</div>
                            <div className="form-header-title min-w-[70px]">Due Date</div>
                            <div className="form-header-title min-w-[70px]">Expected</div>
                            <div className="form-header-title field-price-v3">Actual / Paid (Optional)</div>
                        </div>
                        <div className="shared-form-actions-v3">
                            <div style={{ width: '36px' }}></div>
                        </div>
                    </div>
                )}

                {/* Rows List */}
                <div className="shared-form-body">
                    {rows.map((row, index) => (
                        <div key={row.id} className={`shared-form-row-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                            <div className={`shared-form-input-group-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                                <select
                                    className={`shared-form-field-v3 field-category-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    value={row.categoryId}
                                    onChange={(e) => {
                                        if (e.target.value === 'CREATE_NEW') {
                                            setIsCategoryModalOpen(true);
                                        } else {
                                            handleInputChange(row.id, 'categoryId', e.target.value);
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="CREATE_NEW">➕ Add New Category...</option>

                                    {storedCategories.map((item, index) =>
                                        item.type === 'bills' && (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        )
                                    )}
                                </select>
                                <input
                                    type="text"
                                    className={`shared-form-field-v3 min-w-[70px] ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    placeholder="Bill Name / Description"
                                    value={row.description}
                                    onChange={(e) => handleInputChange(row.id, 'description', e.target.value)}
                                />
                                {/* {rows.length < maxSingleRow && ( */}
                                <div className={`shared-form-label-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                                    Due Date
                                </div>
                                {/* )} */}
                                <input
                                    type="date"
                                    className={`shared-form-field-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    style={{ fontSize: '0.8rem' }}
                                    value={row.dueDate}
                                    onChange={(e) => handleInputChange(row.id, 'dueDate', e.target.value)}
                                />

                                <input
                                    type="number"
                                    className={`shared-form-field-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    placeholder="Expected"
                                    value={row.expected}
                                    onChange={(e) => handleInputChange(row.id, 'expected', accurateDecimal(e.target.value))}
                                />

                                <input
                                    type="number"
                                    className={`shared-form-field-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    placeholder="Actual / Paid (Leave empty if not paid yet - Optional)"
                                    value={row.amount}
                                    onChange={(e) => handleInputChange(row.id, 'amount', accurateDecimal(e.target.value))}
                                />
                            </div>

                            <div className={`shared-form-actions-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
                                <button
                                    className={`shared-form-action-btn-v3 btn-discount-v3 
                                        ${row.isRecurring ? 'active-v3' : ''} 
                                        ${rows.length < maxSingleRow ? 'single' : ''}`}
                                    onClick={() => handleInputChange(row.id, 'isRecurring', !row.isRecurring)}
                                    title={row.isRecurring ? "Recurring Row (Active)" : "Make Recurring Row"}
                                >
                                    <Icon name="LuRepeat" size={18} />
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

                {/* Add Item Button */}
                <button className="shared-form-add-more-v3" onClick={addRow}>
                    <LuPlus size={18} />
                    <span>Add Bill</span>
                </button>

                {/* Footer Submit */}
                <div className="shared-form-footer-v3">
                    <button
                        className={`shared-form-submit-all-v3 ${loading ? 'loading' : ''}`}
                        onClick={handleSubmitAll}
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Save Bills'}
                    </button>
                </div>
            </div>
            <Modal
                title={'Create Category Bills'}
                isModalOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                fullscreen={false}
                maxWidth='550px'
                closeOnOverlay={false}
                // closeOnOverlay={!isBottomSheetOpen}
                zIndex={6000}
            >
                <CategoryForm typeSelected="bills" />
            </Modal>
        </>
    );
};

export default BillsForm;
