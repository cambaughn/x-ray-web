import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import menuStyles from '../../util/design/ActionMenus.module.scss';
import componentStyles from './AddSingleCardMenu.module.scss';
const styles = { ...componentStyles, ...menuStyles };

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
    <div className={classNames(styles.contentWrapper, styles.container)}>
      <div className={styles.mainContent}>
        <h3 className={styles.title}>{card.name}</h3>

        <div className={styles.buttonSection}>
          <p className={classNames(styles.label, styles.labelBottomMargin)}>Finish</p>
          <div className={styles.flexRow}>
            { finishes.map(finish => {
              return (
                <div className={classNames(styles.smallButton, styles.buttonMarginRight, { [styles.buttonSelected]: selectedFinish === finish })} onClick={() => setSelectedFinish(finish)} key={finish}>
                  <span>{finishMap[finish]}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.buttonSection}>
          <p className={classNames(styles.label, styles.labelBottomMargin)}>Grading</p>
          <div className={styles.flexRow}>
            <div className={classNames(styles.smallButton, styles.buttonMarginRight, { [styles.buttonSelected]: graded === false })} onClick={() => setGraded(false)}>
              <span>Ungraded</span>
            </div>

            <div className={classNames({ [styles.smallButton]: true, [styles.buttonSelected]: graded === true })} onClick={() => setGraded(true)}>
              <span>Graded</span>
            </div>
          </div>
        </div>


        <div className={classNames(styles.buttonSection, { [styles.notVisible]: !graded })}>
          <p className={classNames(styles.label, styles.labelBottomMargin)}>Grading Company</p>
          <div className={styles.flexRow}>
            { graders.map((grader) => {
              return (
                <div className={classNames(styles.smallButton, styles.buttonMarginRight, { [styles.buttonSelected]: gradingAuthority === grader })} onClick={() => setGradingAuthority(grader)} key={grader}>
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
          <div className={classNames(styles.buttonSection, styles.flexColumn, { [styles.notVisible]: gradingAuthority.length === 0 })}>
            <p className={classNames(styles.label, styles.labelBottomMargin)}>Grade</p>
            <div className={styles.flexWrapRow}>
              { possibleGrades.map(possibleGrade => {
                return (
                  <div className={classNames(styles.smallButton, styles.gradeButton, { [styles.buttonSelected]: possibleGrade === grade })} onClick={() => setGrade(possibleGrade)} key={possibleGrade}>
                    <span>{possibleGrade}</span>
                  </div>
                )
              })}
            </div>

            { gradingAuthority !== 'PSA' &&
              <div className={classNames(styles.smallButton, { [styles.buttonSelected]: showHalfGrades })} onClick={() => setShowHalfGrades(!showHalfGrades)}>
                <span>Show .5 grades</span>
              </div>
            }
          </div>
        }
      </div>

      <div className={styles.bottomButtonWrapper}>
        <div className={styles.bottomButton} onClick={!submitted ? handleSave : null}>
          <span>Add to collection</span>
        </div>
      </div>

    </div>
  );
}
