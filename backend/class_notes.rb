# post-publish script for BigBlueButton that would run after a class ends and it's recording is processed

require "optimist"
require "psych"

opts = Optimist::options do
  opt :meeting_id, "Meeting id for class notes", :type => String
end
meeting_id = opts[:meeting_id]

props = Psych.load_file(File.join(__dir__, "../presentation.yml"))

recording_path = "/var/bigbluebutton/published/presentation/#{meeting_id}"
webcams_file_path = "#{recording_path}/video"
video_format = props["video_formats"][0]

ffmped_cmd = "ffmpeg -y -i #{webcams_file_path}/webcams.#{video_format} -vn -acodec pcm_s16le -ar 44100 -ac 2 #{webcams_file_path}/audio.wav"

status = system(ffmped_cmd)
puts status
