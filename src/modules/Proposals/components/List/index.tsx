// import React, { PureComponent, useState } from 'react';
import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, withStyles } from '@material-ui/core/styles';
// import styles from './Polls.module.scss';

const useStyles = () => createStyles({
  pagerArea: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

interface ExternalProps {
  className?: string,
}

interface InternalProps {
  proposalList: any,
  isLoadingMore: boolean,
  getProposalList: (contents: any, callback?: any) => any,
  classes: any,
  t: any,
  match: any,
}

interface Props extends ExternalProps, InternalProps { }

interface IndexState {
  currentPage: number
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    proposalList: null,
    isLoadingMore: undefined,
    getProposalList: () => { }
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: parseInt(props.match.params.page, 10) || 1,
    };
  }

  componentDidMount() {
    // this.fetchListPage(this.state.currentPage);
  }

  fetchListPage = (page: number) => {
    this.props.getProposalList({ page });
  };

  render() {
    // const { proposalList, classes, t, className, isLoadingMore } = this.props;
    const { proposalList, t } = this.props;
    console.log(proposalList);
    const proposals = JSON.parse(t('proposal.proposals'));
    console.log(proposals);
    // const [filter, setFilter] = useState<PollStatus | "">("")
    return (
      <div>
        <Helmet>
          <title>{t('header.blocks')}</title>
        </Helmet>
        {/* <article className={styles.component}>
          <header className={styles.header}>
            <LoadingTitle loading={loading} className={styles.title}>
              <TooltipIcon content={Tooltip.Gov.Polls}>
                <h1>{title}</h1>
              </TooltipIcon>
            </LoadingTitle>

            <div className={styles.wrapper}>
              <select
                className={styles.select}
                value={filter}
                onChange={(e) => setFilter(e.target.value as PollStatus)}
              >
                <option value="">All</option>
                {Object.values(PollStatus).map((value) => (
                  <option value={value} key={value}>
                    {value.replace("_", " ")}
                  </option>
                ))}
              </select>
              <Icon name="arrow_drop_down" size={16} />
            </div>
          </header>
        </article> */}
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
