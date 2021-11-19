import React from 'react';
import Card from '@material-ui/core/Card';
import CenteredView from '@/common/View/CenteredView';
import PageViewHeader from '@/common/View/PageViewHeader';
import PageViewTable from '@/common/View/PageViewTable';

interface ExternalProps {
  id: string;
  title: string | React.ReactElement;
  name: string;
  pluralName?: string;
  searchRoute?: string;
  headerIcon?: string;
  headerBackgroundColorClassName?: string;
  bodyColumns: any;
  extraCard?: any;
  extra?: any;
  children?: any;
  className?: string;
}

interface InternalProps {
  // 脱离 saga 外部传入的函数
  onAccountChange: (accounts?: Array<any>) => void;
}

interface Props extends ExternalProps, InternalProps {}

class PageView extends React.PureComponent<Props> {
  render() {
    const {
      id,
      title,
      name,
      pluralName,
      searchRoute,
      headerIcon,
      headerBackgroundColorClassName,
      bodyColumns,
      extraCard,
      extra,
      className,
      onAccountChange,
    } = this.props;
    return (
      <CenteredView className={className}>
        <Card>
          <PageViewHeader
            id={id}
            title={title}
            name={name}
            pluralName={pluralName}
            searchRoute={searchRoute}
            icon={headerIcon}
            onAccountChange={onAccountChange}
            backgroundColorClassName={headerBackgroundColorClassName}
          />
          <PageViewTable columns={bodyColumns} />
          {extraCard}
        </Card>
        {extra}
      </CenteredView>
    );
  }
}

export default PageView;
