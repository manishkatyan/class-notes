/* eslint-disable no-undef */
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout, Space, Row, Col, Card, Divider } from 'antd';
import { Typography } from 'antd';
import AppConfig from '../utils/config';
import Title from '../components/Title';
import VideoPlayer from '../components/VideoPlayer';
import Topics from '../components/Topics';
import Summary from '../components/Summary';

const { Paragraph } = Typography;
const { Content } = Layout;
const ClassNotes = () => {
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('meetingId');
  const [topicsTag, setTopicsTag] = React.useState('');
  let classNotes = {};

  const handleTopicsTagClick = (tag, checked) => {
    checked ? setTopicsTag(tag) : setTopicsTag('');
  };

  if (meetingId) {
    // load json file
    try {
      const data = require(`/var/bigbluebutton/published/presentation/${meetingId}/class_notes.json`);
      classNotes = { ...data };
    } catch (error) {
      console.log(error);
    }
  }

  const videoJsOptions = {
    autoplay: false,
    aspectRatio: '16:9',
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: `${AppConfig.bbbServerUrl}/recording/mp4/${meetingId}.mp4`,
        type: 'video/mp4',
      },
    ],
    tracks: [
      {
        kind: 'captions',
        src: `${AppConfig.bbbServerUrl}/presentation/${meetingId}/captions.vtt`,
        srcLang: '',
        label: 'Caption On',
        default: true,
      },
    ],
  };

  return (
    <Content style={{ padding: '20px 50px  50px' }}>
      <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
        {/* Title */}
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24, offset: 0 }} lg={{ span: 15, offset: 4 }}>
            <Title meetingName={classNotes.meeting_name} startTime={classNotes.start_time} />
          </Col>
        </Row>

        {/* Video player */}
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24, offset: 0 }} lg={{ span: 15, offset: 4 }}>
            <VideoPlayer
              options={videoJsOptions}
              onReady={() => {
                console.log('Player is ready');
              }}
            />
          </Col>
        </Row>

        <Card>
          {/* Topics */}
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
            }}
          >
            Topics
          </h1>
          <Paragraph>
            {classNotes && classNotes.topics ? (
              <Topics
                selectedTopic={topicsTag}
                handleClick={handleTopicsTagClick}
                topics={classNotes.topics.summary}
              />
            ) : (
              'No topics available'
            )}
          </Paragraph>
          <Divider />

          {/* Summary */}
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
            }}
          >
            Summary
          </h1>
          {classNotes && classNotes.summary ? (
            <Paragraph style={{ fontSize: '120%' }}>
              <Summary summary={classNotes.summary} />
            </Paragraph>
          ) : (
            <p>No summary available</p>
          )}
          <Divider />
        </Card>
      </Space>
    </Content>
  );
};

export default ClassNotes;
