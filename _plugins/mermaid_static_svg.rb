# frozen_string_literal: true

require 'fileutils'
require 'open3'
require 'tempfile'

# Converts fenced Mermaid blocks in posts into static SVG images during Jekyll's
# build. The source Markdown remains unchanged; only the generated site uses the
# image tags. Each block must start with an id directive, for example:
#
# ```mermaid
# %% id: sign-up
# %% alt: Registration flow
# flowchart LR
#   A --> B
# ```
module MermaidStaticSvg
  FENCE = /```mermaid[^\r\n]*\r?\n(?<source>.*?)\r?\n```/m.freeze
  ID = /^\s*%%\s*id:\s*(?<value>[A-Za-z0-9][A-Za-z0-9_-]*)\s*$/i.freeze
  ALT = /^\s*%%\s*alt:\s*(?<value>.+?)\s*$/i.freeze

  module_function

  def render(document, id, definition)
    site = document.site
    output = File.join(site.source, 'assets', 'images', "#{id}.svg")
    FileUtils.mkdir_p(File.dirname(output))

    executable = File.join(site.source, 'node_modules', '.bin', Gem.win_platform? ? 'mmdc.cmd' : 'mmdc')
    unless File.exist?(executable)
      raise Jekyll::Errors::FatalException, 'Mermaid CLI is missing. Run npm install before building the site.'
    end

    Tempfile.create(['mermaid-', '.mmd']) do |source|
      source.write(definition)
      source.flush
      _stdout, stderr, status = Open3.capture3(executable, '-i', source.path, '-o', output, '-b', 'transparent')
      return if status.success?

      raise Jekyll::Errors::FatalException, "Mermaid diagram #{id} could not be rendered: #{stderr}"
    end
  end

  def replace_block(document, match)
    lines = match[:source].lines
    id = nil
    alt = nil
    diagram = lines.reject do |line|
      if (marker = ID.match(line))
        id = marker[:value]
        true
      elsif (marker = ALT.match(line))
        alt = marker[:value]
        true
      else
        false
      end
    end.join

    unless id
      raise Jekyll::Errors::FatalException, 'Each Mermaid block needs a `%% id: diagram-name` directive.'
    end

    render(document, id, diagram)
    alt ||= id.tr('-', ' ')
    path = "{{ site.baseurl }}/assets/images/#{id}.svg"
    %(<a href="#{path}" target="_blank" rel="noopener" title="在新标签打开 SVG 原图，可选择并复制流程文字"><img src="#{path}" alt="#{alt}" loading="lazy"></a>)
  end
end

Jekyll::Hooks.register :posts, :pre_render do |document|
  document.content = document.content.gsub(MermaidStaticSvg::FENCE) do |match|
    MermaidStaticSvg.replace_block(document, Regexp.last_match)
  end
end
