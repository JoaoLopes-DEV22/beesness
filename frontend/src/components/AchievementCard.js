// src/components/AchievementCard.js
import React from 'react';
import '../css/components/AchievementCard.css'; // Crie este CSS para estilizar o card de conquista

function AchievementCard({ achievement, onClaimAchievement }) {
  // CORREÇÃO AQUI: As informações de status do usuário/conta vêm dentro de achievement.account_status
  const isCompleted = achievement.account_status ? achievement.account_status.is_completed : false;
  const isClaimed = achievement.account_status ? achievement.account_status.is_claimed : false;
  const currentProgress = achievement.account_status ? achievement.account_status.current_progress : 0;
  // Se 'target_progress' está na definição da conquista em 'achievement'
  const targetProgress = achievement.target_progress || 1; 

  let buttonText;
  let buttonClass;
  let buttonDisabled = false;
  let buttonClickHandler;

  if (isCompleted && !isClaimed) {
    buttonText = 'Resgatar';
    buttonClass = 'claim_button'; // Classe para quando está pronto para resgatar
    buttonClickHandler = () => onClaimAchievement(achievement.id_achievement);
  } else if (isClaimed) {
    buttonText = 'Resgatado';
    buttonClass = 'claimed_button disabled_button'; // Classe para quando já foi resgatado
    buttonDisabled = true;
    buttonClickHandler = null;
  } else {
    buttonText = 'Em Andamento';
    buttonClass = 'disabled_button'; // Classe para quando ainda está em progresso
    buttonDisabled = true;
    buttonClickHandler = null;
  }

  return (
    <div className="shop_card achievement_card">
      <div className="title_shop_card">
        <div className="achievement_icon">
          {/* Usando o path_icon_achievement da conquista */}
          {achievement.path_icon_achievement ? (
            <img src={achievement.path_icon_achievement} alt="Ícone Conquista" style={{ width: '24px', height: '24px' }} />
          ) : (
            <img src="/assets/trophy.png" alt="Ícone Padrão" style={{ width: '24px', height: '24px' }} />
          )}
        </div>
        <div className="achievement_title">
          <p className="achievement_text_title">{achievement.title_goal}</p>
          <p className="achievement_text_description">{achievement.description_achievement}</p>
        </div>
      </div>

      <div className="content_shop_card">
        <div className="achievement_prize">
          <p className='level_text'>{achievement.sunflowers_achievement} 🌻</p>
          <p className='level_text'>{achievement.experience_achievement} XP</p>
          {/* Você pode adicionar um indicador de progresso aqui se 'current_progress' e 'target_progress' forem usados */}
          {/* {targetProgress > 1 && (
            <p className='level_text'>Progresso: {currentProgress}/{targetProgress}</p>
          )} */}
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