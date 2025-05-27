// src/components/AccessoryCard.js
import React from 'react';
import '../css/components/ShopCard.css'; // Você pode ter um CSS genérico para cards de loja, ou criar um específico

function AccessoryCard({ accessory, ownedAccessoryData, beeLevel, sunflowers, onBuyAccessory, onToggleEquipAccessory }) {
    const isOwned = !!ownedAccessoryData;
    const isEquipped = isOwned ? ownedAccessoryData.isEquipped : false;
    const isLevelInsufficient = beeLevel < accessory.level_accessory;
    const isPriceInsufficient = parseFloat(sunflowers) < parseFloat(accessory.price_accessory);

    let buttonText;
    let buttonClass;
    let buttonDisabled = false;
    let buttonClickHandler;

    if (isOwned) {
        buttonText = isEquipped ? 'Desequipar' : 'Equipar';
        buttonClass = isEquipped ? 'unequip_button' : 'equip_button';
        buttonClickHandler = () => onToggleEquipAccessory(ownedAccessoryData.beeAccessoryId);
    } else if (isLevelInsufficient) {
        buttonText = `Nível ${accessory.level_accessory} Necessário`;
        buttonClass = 'buy_button disabled_button';
        buttonDisabled = true;
        buttonClickHandler = null;
    } else if (isPriceInsufficient) {
        buttonText = `Girassóis Insuficientes`;
        buttonClass = 'buy_button disabled_button';
        buttonDisabled = true;
        buttonClickHandler = null;
    } else {
        buttonText = `Comprar`;
        buttonClass = 'buy_button';
        buttonDisabled = false;
        buttonClickHandler = () => onBuyAccessory(accessory.id_accessory);
    }

    return (
        <div className="shop_card">
            <div className="title_shop_card">
                <div className="accessory_title">
                    <div className="accessory_icon">
                        {accessory.icon_accessory}
                    </div>
                    <p className="accessory_text">{accessory.name_accessory}</p>
                </div>
                <div className="accessory_level">
                    <p className='level_text'>Nível {accessory.level_accessory}</p>
                </div>
            </div>

            <div className="content_shop_card">
                <div className="accessory_price">
                    <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                    <p className="acessory_value">{parseInt(accessory.price_accessory)}</p>
                </div>
                <button
                    className={buttonClass}
                    disabled={buttonDisabled}
                    onClick={buttonClickHandler}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

export default AccessoryCard;