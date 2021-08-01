import React, { useState, useEffect } from 'react';
// TODO: add base styles for the modals and combine with styles for this menu in particular
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import menuStyles from '../../util/design/ActionMenus.module.scss';
import styles from './AddSingleCardMenu.module.scss';

// Utility functions
import { setCollectedItems, setCollectionDetails } from '../../redux/actionCreators';
import { getNowAsStringWithTime } from '../../util/helpers/date';
import collectedItem from '../../util/api/collection';
import pokeCard from '../../util/api/card';
import analytics from '../../util/analytics/segment';

const finishMap = {
  'non-holo': 'Non-holo',
  'reverse_holo': 'Reverse holo',
  'holo': 'Holo'
}

export default function AddSingleCardMenu({ finishes = [] }) {
  const [selectedFinish, setSelectedFinish] = useState(finishes[0] || 'holo'); // holo, non-holo, reverse_holo
  const [graded, setGraded] = useState(false);
  const [gradingAuthority, setGradingAuthority] = useState('PSA');
  const [grade, setGrade] = useState(10);
  const [showHalfGrades, setShowHalfGrades] = useState(false);
  const [possibleGrades, setPossibleGrades] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector(state => state.user);
  const card = useSelector(state => state.focusedCard);
  const dispatch = useDispatch();

  finishes = finishes.length > 0 ? finishes : ['holo', 'reverse_holo', 'non-holo'];

  const graders = ['PSA', 'BGS', 'CGC', 'GMA', 'SGC'];
  // const graders = ['PSA', 'BGS', 'CGC', 'GMA', 'SGC'];

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

  const getCollectedItems = async () => {
    let item_details = await collectedItem.getForUser(user.id);
    dispatch(setCollectionDetails(item_details));

    let itemsToGet = item_details.map(detail => detail.item_id);
    let items = await pokeCard.getMultiple(itemsToGet);
    let itemLookup = {};
    items.forEach(item => {
      itemLookup[item.id] = item;
    })
    dispatch(setCollectedItems(itemLookup));
    Promise.resolve(true);
  }

  const handleSave = async () => {
    try {
      setSubmitted(true);
      let item = {
        user_id: user.id,
        item_id: card.id,
        collection_id: 'pokemon_cards',
        date_added: getNowAsStringWithTime(),
        finish: null,
        version: null,
        grading_authority: graded ? gradingAuthority : null,
        grade: graded ? grade : null,
        type: 'pokemon'
      }

      await collectedItem.create(item);

      await getCollectedItems();

      analytics.track({
        userId: user.id,
        event: 'Added card to collection'
      });

      dispatch(setActionModalStatus(''));
      toggleModal();
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(getGrades, [gradingAuthority, showHalfGrades]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{card.name}</h2>

      <h4 className={styles.gradingTitle}>Finish</h4>
      <div className={styles.finishButtons}>
        { finishes.map(finish => {
          return (
            <div className={classNames({ [styles.button]: true, [styles.finishButton]: true, [styles.selectedButton]: selectedFinish === finish })} onClick={() => setSelectedFinish(finish)} key={finish}>
              <span>{finishMap[finish]}</span>
            </div>
          )
        })}
      </div>


      <h4 className={styles.gradingTitle}>Grading</h4>

      <div className={styles.gradedButtons}>
        <div className={classNames({ [styles.button]: true, [styles.gradedButton]: true, [styles.selectedButton]: graded === false })} onClick={() => setGraded(false)}>
          <span>Ungraded</span>
        </div>

        <div className={classNames({ [styles.button]: true, [styles.gradedButton]: true, [styles.selectedButton]: graded === true })} onClick={() => setGraded(true)}>
          <span>Graded</span>
        </div>
      </div>


      <div className={classNames({ [styles.gradingAuthority]: true, [styles.gradingAuthorityVisible]: graded })}>
        <h4 className={styles.gradingTitle}>Grading Company</h4>
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

      <div className={classNames(styles.button, styles.saveButton)} onClick={!submitted ? handleSave : null}>
        <span>Add to collection</span>
      </div>

    </div>
  );
}
