// src/components/DecorationCard.js
import React from 'react';
import '../css/components/ShopCard.css'; // Reutiliza o CSS para cards de loja

function DecorationCard({ decoration, ownedDecorationData, beeLevel, sunflowers, onBuyDecoration }) {
    const isOwned = !!ownedDecorationData;
    const isLevelInsufficient = beeLevel < decoration.level_decoration;
    const isPriceInsufficient = parseFloat(sunflowers) < parseFloat(decoration.price_decoration);

    let buttonText;
    let buttonClass;
    let buttonDisabled = false;
    let buttonClickHandler;

    if (isOwned) {
        buttonText = 'Adquirido';
        buttonClass = 'acquired_button disabled_button';
        buttonDisabled = true;
        buttonClickHandler = null;
    } else if (isLevelInsufficient) {
        buttonText = `Nível ${decoration.level_decoration} Necessário`;
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
        buttonClickHandler = () => onBuyDecoration(decoration.id_decoration);
    }

    return (
        <div className="shop_card">
            <div className="title_shop_card">
                <div className="accessory_title">
                    <div className="accessory_icon">
                        {decoration.icon_decoration}
                    </div>
                    <p className="accessory_text">{decoration.name_decoration}</p>
                </div>
                <div className="accessory_level">
                    <p className='level_text'>Nível {decoration.level_decoration}</p>
                </div>
            </div>

            <div className="content_shop_card">
                <div className="accessory_price">
                    <img src="/assets/sunflower.png" alt="Girassol" className='sunflower_icon' />
                    <p className="acessory_value">{parseInt(decoration.price_decoration)}</p>
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

export default DecorationCard;