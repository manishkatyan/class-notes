/* eslint-disable no-undef */
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout, Space, Row, Col } from 'antd';
const { Content } = Layout;
import AppConfig from '../utils/config';
import Title from '../components/Title';
import VideoPlayer from '../components/VideoPlayer';

const ClassNotes = () => {
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('meetingId');
  let classNotes = {};

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
    <Content>
      <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24, offset: 0 }} lg={{ span: 15, offset: 4 }}>
            <Title meetingName={classNotes.meeting_name} startTime={classNotes.start_time} />
          </Col>
        </Row>

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
      </Space>
    </Content>
  );
};

export default ClassNotes;
