// src/components/AchievementCard.js
import React from 'react';
import '../css/components/AchievementCard.css'; // Crie este CSS para estilizar o card de conquista

function AchievementCard({ achievement, userAchievement, onClaimAchievement }) {
    // Extrai o status da conquista do objeto userAchievement (se existir)
    const isCompleted = userAchievement ? userAchievement.is_completed : false;
    const isClaimed = userAchievement ? userAchievement.is_claimed : false;
    const currentProgress = userAchievement ? userAchievement.current_progress : 0;
    const targetProgress = achievement.target_progress || 1; // Assumindo 'target_progress' na conquista

    let buttonText;
    let buttonClass;
    let buttonDisabled = false;
    let buttonClickHandler;

    if (isCompleted && !isClaimed) {
        buttonText = 'Resgatar';
        buttonClass = 'claim_button';
        buttonClickHandler = () => onClaimAchievement(achievement.id_achievement);
    } else if (isClaimed) {
        buttonText = 'Resgatado';
        buttonClass = 'claimed_button disabled_button';
        buttonDisabled = true;
        buttonClickHandler = null;
    } else {
        buttonText = 'Em Andamento';
        buttonClass = 'disabled_button'; // Ou uma classe específica para "em andamento"
        buttonDisabled = true;
        buttonClickHandler = null;
    }

    return (
        <div className="shop_card achievement_card"> {/* Adicione uma classe específica para o card de conquista */}
            <div className="title_shop_card">
                <div className="achievement_icon">
                    {/* Placeholder para ícone da conquista, idealmente viria de achievement.icon_achievement */}
                    <img src="/assets/trophy.png" alt="Ícone Conquista" style={{ width: '24px', height: '24px' }} />
                </div>
                <div className="achievement_title">

                    {/* Usando title_goal como nome da conquista */}
                    <p className="achievement_text_title">{achievement.title_goal}</p>
                    <p className="achievement_text_description">{achievement.description_achievement}</p>

                </div>

            </div>

            <div className="content_shop_card">
                <div className="achievement_prize">

                    {/* Usando sunflowers_achievement para a recompensa */}
                    <p className='level_text'>{achievement.sunflowers_achievement} 🌻</p>
                    <p className='level_text'>{achievement.experience_achievement} XP</p>

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

export default AchievementCard;