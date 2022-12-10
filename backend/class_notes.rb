#!/usr/bin/ruby
# encoding: UTF-8

# post-publish script for BigBlueButton that would run after a class ends and it's recording is processed

require "optimist"
require "psych"
require "json"
require "net/http"
require "openssl"

opts = Optimist::options do
  opt :meeting_id, "Meeting id for class notes", :type => String
end
meeting_id = opts[:meeting_id]

props = Psych.load_file(File.join(__dir__, "../presentation.yml"))
recording_path = "/var/bigbluebutton/published/presentation/#{meeting_id}"
webcams_file_path = "#{recording_path}/video"
video_format = props["video_formats"][0]

def http_client(uri, method, body = nil)
  uri = URI(uri)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  request = ""
  if method == "post"
    request = Net::HTTP::Post.new(
      uri,
      "authorization" => "e415a85f0b2b49f09da931ae0a6efd80",
      "content-type" => "application/json",
    )
  end
  if method == "get"
    request = Net::HTTP::Get.new(
      uri,
      "authorization" => "e415a85f0b2b49f09da931ae0a6efd80",
      "content-type" => "application/json",
    )
  end

  if !body.nil?
    request.body = body.to_json
  end

  response = http.request(request)
  return response
end

begin
  ffmped_cmd = "ffmpeg -y -i #{webcams_file_path}/webcams.#{video_format} -vn -acodec pcm_s16le -ar 44100 -ac 2 #{webcams_file_path}/audio.wav"

  status = system(ffmped_cmd)
  if status
    assemblyai_options = {
      "audio_url" => "https://bbb01.quiklrn.net/presentation/#{meeting_id}/video/audio.wav",
      "summarization" => true,
      "summary_type" => "bullets",
      "summary_model" => "informative",
      "punctuate" => true,
      "format_text" => true,
      "iab_categories" => true,
      "speaker_labels" => true,
      "sentiment_analysis" => true,
    }

    response = http_client("https://api.assemblyai.com/v2/transcript", "post", assemblyai_options)

    transcript_id = JSON.parse(response.body)["id"]
    puts transcript_id

    # poll for the transcription
    is_transcription_done = false

    while !is_transcription_done
      response = http_client("https://api.assemblyai.com/v2/transcript/#{transcript_id}", "get")
      transcription_data = JSON.parse(response.body)
      puts "Status: #{transcription_data["status"]}"

      if transcription_data["status"] == "error"
        raise "Unable to get the transcription!"
      end

      if transcription_data["status"] == "completed"
        is_transcription_done = true
        puts "Transcription is ready"
        puts transcription_data
      end
      sleep(5)
    end

    exit 0
  end
rescue => exception
  puts exception
  exit 0
end
