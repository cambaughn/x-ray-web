import React, { useState, useEffect } from 'react';
import styles from './AddCardModal.module.scss';
import classNames from 'classnames';

/**
  This is a full screen modal that wraps around another component, providing a standard interface.
  It's a floating card with on a semi-transparent background that hovers over the rest of the page.
  @param {function} toggleModal - Gives the ability to toggle on/off
*/

export default function AddCardModal({ toggleModal, card }) {
  const [graded, setGraded] = useState(false);
  const [gradingAuthority, setGradingAuthority] = useState('');
  const [grade, setGrade] = useState(10);
  const [showHalfGrades, setShowHalfGrades] = useState(false);
  const [possibleGrades, setPossibleGrades] = useState([]);

  const graders = ['PSA', 'BGS', 'CGC', 'Other'];

  const getGrades = () => {
    let grades = [];
    let startingNum = 10;

    if (gradingAuthority === 'CGC' || gradingAuthority === 'BGS') {
      startingNum = showHalfGrades ? 9.5 : 10;
      let selectedGrade = Number.isInteger(grade) ? grade + 0.5 : grade;
      selectedGrade = selectedGrade > 10 ? 9.5 : selectedGrade;
      setGrade(selectedGrade);
    } else if (gradingAuthority === 'PSA' || gradingAuthority === 'Other') {
      setGrade(Math.ceil(grade));
    }

    for (let i = startingNum; i >= 1; i--) {
      grades.push(i);
    }

    setPossibleGrades(grades)
  }

  const handleSave = async () => {

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
            { (gradingAuthority === 'CGC' || gradingAuthority === 'BGS') &&
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
