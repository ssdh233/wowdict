-- close frame by esc
tinsert(UISpecialFrames, DictFrame:GetName())

SLASH_LOOKUP1 = "/d"
SLASH_LOOKUP2 = "/dict"
SlashCmdList["LOOKUP"] = function(msg)
  if (DictLog == nil) then
    DictLog = {}
  end

  if ( DictSourceEN1[msg] or DictSourceEN2[msg] or DictSourceCN1[msg] or DictSourceCN2[msg] ) then
    table.insert(DictLog, msg)
    DictScrollFrame:SetVerticalScroll(0);
    DictFrameWord:SetText(msg);

    if (DictSourceEN1[msg]) then
      DictFramePronounciationEN:SetText(DictSourceEN1[msg]["pron"]);
      DictFrameDefinitionEN:SetText(DictSourceEN1[msg]["def"]);
    elseif (DictSourceEN2[msg]) then
      DictFramePronounciationEN:SetText(DictSourceEN2[msg]["pron"]);
      DictFrameDefinitionEN:SetText(DictSourceEN2[msg]["def"]);
    else 
      DictFramePronounciationEN:SetText("");
      DictFrameDefinitionEN:SetText("");
    end

    if (DictSourceCN1[msg]) then
      DictFramePronounciationCN:SetText(DictSourceCN1[msg]["pron"]);
      DictFrameDefinitionCN:SetText(DictSourceCN1[msg]["def"].."\n\n");
    elseif (DictSourceCN2[msg]) then
      DictFramePronounciationCN:SetText(DictSourceCN2[msg]["pron"]);
      DictFrameDefinitionCN:SetText(DictSourceCN2[msg]["def"].."\n\n");
    else
      DictFramePronounciationCN:SetText("");
      DictFrameDefinitionCN:SetText("");
    end
    ShowUIPanel(DictFrame)
    ShowUIPanel(DictScrollChildFrame)

    local enPronHeight = DictFramePronounciationEN:GetStringHeight()
    DictFrameDefinitionEN:SetPoint("TOPLEFT", 20, -(enPronHeight + 20))

    local enDefHeight = DictFrameDefinitionEN:GetStringHeight()
    DictFramePronounciationCN:SetPoint("TOPLEFT", 20, -(enPronHeight + 20 + enDefHeight + 100))

    local cnPronHeight = DictFramePronounciationCN:GetStringHeight()
    DictFrameDefinitionCN:SetPoint("TOPLEFT", 20, -(enPronHeight + 20 + enDefHeight + 100 + cnPronHeight + 20))
  end
  -- print("Log:")
  -- print(table.concat(DictLog,", "))
end 
