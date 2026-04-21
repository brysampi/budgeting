import React, { useState, useEffect } from 'react';
import { LuPlus, LuMinus, LuCheck, LuWallet, LuCalendar, LuBolt } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { bills, getAllDataActiveRealTimeController } from '../../../library/firebase/controller';
import { getTodayDate, generateUniqueID } from '../../../library/utils';
import { walletStorage } from '../../../library/zustand/storage';
import { Icon } from '../../../assets/Icons';
import Big from "big.js";

const BillsForm = ({ onFinish }) => {
    const { paramMonth } = useParams();
    const [loading, setLoading] = useState(false);

    const storedWallets = walletStorage((state) => state.data) || [];
    const [headerDate, setHeaderDate] = useState(getTodayDate());
    const [selectedWallet, setSelectedWallet] = useState(storedWallets[storedWallets.length - 1].id);
    const [wallets, setWallets] = useState([]);
    const [isWalletsFetching, setIsWalletsFetching] = useState(true);

    // Manage multiple rows
    const maxSingleRow = 3;
    const [rows, setRows] = useState([
        { id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }
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
        setRows([...rows, { id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        } else {
            setRows([{ id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }]);
        }
    };

    const handleSubmitAll = async () => {
        // if (!selectedWallet) {
        //     alert("Please select a wallet");
        //     return;
        // }

        // const invalidRows = rows.filter(row => !row.description || !row.budget || !row.dueDate);
        // if (invalidRows.length > 0) {
        //     alert("Please fill in (Description, Budget, Due Date) for all rows.");
        //     return;
        // }

        // setLoading(true);
        // let successCount = 0;

        for (const row of rows) {
            const data = {
                description: row.description,
                budget: new Big(row.budget),
                actual: row.actual ? new Big(row.actual) : new Big(0),
                dueDate: row.dueDate,
                wallet: selectedWallet,
                date: headerDate,
            };

            // const result = await bills(data);
            // if (result.status === 'success') {
            //     successCount++;
            // }
        }

        // if (successCount === rows.length) {
        //     if (onFinish) onFinish();
        //     setRows([{ id: generateUniqueID(), description: '', budget: '', actual: '', dueDate: getTodayDate() }]);
        // } else if (successCount > 0) {
        //     alert(`Successfully added ${successCount} of ${rows.length} bills.`);
        // }
        // setLoading(false);
    };

    return (
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
                            storedWallets.map((wallet,index) => (
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

            {/* Table Header */}
            {rows.length >= maxSingleRow && (
                <div className="shared-form-table-header-v3">
                    <div className="shared-form-input-group-v3" style={{ background: 'transparent', border: 'none', borderRadius: 0 }}>
                        <div className="form-header-title field-description-v3">Bill Name / Description</div>
                        <div className="form-header-title" style={{ flex: 1 }}>Due Date</div>
                        <div className="form-header-title field-price-v3">Budget</div>
                        <div className="form-header-title field-price-v3">Actual</div>
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
                            <input
                                type="text"
                                className={`shared-form-field-v3 field-description-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
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
                                className={`shared-form-field-v3 field-price-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                placeholder="Budget"
                                value={row.budget}
                                onChange={(e) => handleInputChange(row.id, 'budget', e.target.value)}
                            />

                            <input
                                type="number"
                                className={`shared-form-field-v3 field-price-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}
                                placeholder="Actual"
                                value={row.actual}
                                onChange={(e) => handleInputChange(row.id, 'actual', e.target.value)}
                            />
                        </div>

                        <div className={`shared-form-actions-v3 ${rows.length < maxSingleRow ? 'single' : ''}`}>
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
    );
};

export default BillsForm;
