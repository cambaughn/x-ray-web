import React, { useState, useEffect } from 'react';
import styles from './AddCardModal.module.scss';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

// Utility functions
import { getNowAsStringWithTime } from '../../util/helpers/date';


export default function AddCardModal({ toggleModal, card }) {
  const [graded, setGraded] = useState(false);
  const [gradingAuthority, setGradingAuthority] = useState('PSA');
  const [grade, setGrade] = useState(10);
  const [showHalfGrades, setShowHalfGrades] = useState(false);
  const [possibleGrades, setPossibleGrades] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector(state => state.user);

  const graders = ['PSA', 'BGS', 'CGC', 'GMA'];

  const getGrades = () => {
    let grades = [];
    let startingNum = 10;

    if (gradingAuthority === 'PSA') {
      setGrade(Math.ceil(grade));
    } else {
      startingNum = showHalfGrades ? 9.5 : 10;
      let selectedGrade = grade;

      if (showHalfGrades && Number.isInteger(grade)) {
        selectedGrade = grade - 0.5;
        selectedGrade = selectedGrade < 1 ? 1 : selectedGrade;
      } else if (!showHalfGrades && !Number.isInteger(grade)) {
        selectedGrade = grade + 0.5;
        selectedGrade = selectedGrade > 10 ? 10 : selectedGrade;
      }

      setGrade(selectedGrade);
    }

    for (let i = startingNum; i >= 1; i--) {
      grades.push(i);
    }

    setPossibleGrades(grades)
  }

  const handleSave = async () => {
    try {
      let item = {
        user_id: user.id,
        item_id: card.id,
        collection_id: 'pokemon_cards',
        date_added: getNowAsStringWithTime(),
        finish: null,
        version: null,
        grading_authority: graded ? gradingAuthority : null,
        grade: graded ? grade : null
      }

      console.log('item => ', item);

      // toggleModal();
    } catch(error) {
      console.error(error);
    }
  }

  const stopClick = (event) => {
    event.stopPropagation();
  }

  useEffect(getGrades, [gradingAuthority, showHalfGrades]);

  return (
    <div className={styles.container} onClick={toggleModal}>
      <div className={styles.card} onClick={stopClick}>
        <h2 className={styles.title}>{card.name}</h2>

        <div className={styles.gradedButtons}>
          <div className={classNames({ [styles.button]: true, [styles.gradedButton]: true, [styles.selectedButton]: graded === false })} onClick={() => setGraded(false)}>
            <span>Ungraded</span>
          </div>

          <div className={classNames({ [styles.button]: true, [styles.gradedButton]: true, [styles.selectedButton]: graded === true })} onClick={() => setGraded(true)}>
            <span>Graded</span>
          </div>
        </div>


        <div className={classNames({ [styles.gradingAuthority]: true, [styles.gradingAuthorityVisible]: graded })}>

          <h4 className={styles.gradingTitle}>Grading</h4>
          <div className={styles.gradingAuthorityButtons}>
            { graders.map((grader) => {
              return (
                <div className={classNames({ [styles.button]: true, [styles.gradingAuthorityButton]: true, [styles.selectedButton]: gradingAuthority === grader })} onClick={() => setGradingAuthority(grader)} key={grader}>
                  <span>{grader}</span>
                </div>
              )
            })}
          </div>

          {/* { gradingAuthority === 'Other' &&
            <input
              type='text'
              value={otherGrader}
              className={styles.otherGraderInput}
              onChange={event => setOtherGrader(event.target.value)}
              placeholder='Grader...'
            />
          } */}
        </div>

        { gradingAuthority.length > 0 && graded &&
          <div className={classNames({ [styles.gradeSelection]: true, [styles.gradeSelectionVisible]: gradingAuthority.length > 0 })}>
            <div className={styles.grades}>
              { possibleGrades.map(possibleGrade => {
                return (
                  <div className={classNames({ [styles.button]: true, [styles.gradeButton]: true, [styles.selectedButton]: possibleGrade === grade })} onClick={() => setGrade(possibleGrade)} key={possibleGrade}>
                    <span>{possibleGrade}</span>
                  </div>
                )
              })}
            </div>
            { gradingAuthority !== 'PSA' &&
              <div className={classNames({ [styles.button]: true, [styles.halfGradeButton]: true, [styles.selectedButton]: showHalfGrades })} onClick={() => setShowHalfGrades(!showHalfGrades)}>
                <span>Show .5 grades</span>
              </div>
            }
          </div>
        }

        <div className={classNames(styles.button, styles.saveButton)} onClick={handleSave}>
          <span>Add to collection</span>
        </div>

      </div>
    </div>
  );
}
