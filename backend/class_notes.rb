# post-publish script for BigBlueButton that would run after a class ends and it's recording is processed

require "optimist"
require File.expand_path("../../../lib/recordandplayback", __FILE__)

opts = Optimist::options do
  opt :meeting_id, "Meeting id for class notes", :type => String
end
meeting_id = opts[:meeting_id]

logger = Logger.new("/var/log/bigbluebutton/post_publish.log", "weekly")
logger.level = Logger::INFO
BigBlueButton.logger = logger

published_files = "/var/bigbluebutton/published/presentation/#{meeting_id}"
meeting_metadata = BigBlueButton::Events.get_meeting_metadata("/var/bigbluebutton/recording/raw/#{meeting_id}/events.xml")

#
# Put your code here
#

exit 0
